'use strict';
var app = require('../../server/server');
var emailService = require('../services/emailService');


module.exports = function (Logsensor) {

  var methodNames = ['prototype.patchAttributes', 'createChangeStream', 'exists', 'patchOrCreate',
    'replace', 'replaceById', 'findOne', 'upsertWithWhere', 'count', 'replaceOrCreate', 'updateAll'
  ]

  methodNames.forEach(function (methodName) {
    Logsensor.disableRemoteMethodByName(methodName);
  });

  Logsensor.sendInformation = async function (guid, valor, cb) {

    var Sensor = app.models.Sensor;
    var Acao = app.models.Acao;
    var sensor, parametro, usuario, enviou;

    // Busca a informacao do sensor
    await new Promise((resolve, reject) => {
      Sensor.find({
        where: {
          guid: guid,
        },
        include: ['parametros', 'usuario'],
      }, (err, sensores) => {
        if (err) return reject(err);
        if (sensores.length === 0) {
          var error = new Error();
          error.message = 'Sensor não encontrado';
          error.status = 404;
          return reject(error);
        } else {
          sensor = JSON.parse(JSON.stringify(sensores[0]));
          parametro = sensor.parametros;
          usuario = sensor.usuario;
          resolve();
        }
      });
    });

    // Cria o log do Sensor
    await new Promise((resolve, reject) => {
      Logsensor.create({
        sensorId: sensor.id,
        valor: valor,
        valido: true,
      }, (err, res) => {
        if (err) return reject(err);
        if (res) resolve();
      });
    });

    // Verifica se ja enviou o aviso no periodo
    await new Promise((resolve, reject) => {
      enviou = false;
      Logsensor.checkAcao(parametro.periodo, sensor.id, (err, res) => {
        if (err) return reject(err);
        if (res) {
          if (res[0].count >= 1) {
            enviou = true;
          }
          resolve();
        }
      });
    });

    // Verifica o valor do sensor de acordo com o tipo
    await new Promise((resolve, reject) => {
      if (sensor.tipo === 1) {
        Logsensor.sum(parametro.periodo, sensor.id, (err, res) => {
          if (err) return reject(err);
          if (res) {
            valor = res[0].sum;
            resolve();
          }
        });
      } else {
        resolve();
      }
    });

    // Verifica se passou o parametro
    await new Promise((resolve, reject) => {
      var aviso = false;
      switch (parametro.operadorMinimo) {
        case '0':
          if (parametro.valorMinimo > valor) {
            aviso = true;
          }
          break;
        case '1':
          if (parametro.valorMinimo >= valor) {
            aviso = true;
          }
          break;
        case '2':
          if (parametro.valorMinimo === valor) {
            aviso = true;
          }
          break;
        case '3':
          if (parametro.valorMinimo < valor) {
            aviso = true;
          }
          break;
        case '4':
          if (parametro.valorMinimo <= valor) {
            aviso = true;
          }
          break;
      }
      switch (parametro.operadorMaximo) {
        case '0':
          if (parametro.valorMaximo > valor) {
            aviso = true;
          }
          break;
        case '1':
          if (parametro.valorMaximo >= valor) {
            aviso = true;
          }
          break;
        case '2':
          if (parametro.valorMaximo === valor) {
            aviso = true;
          }
          break;
        case '3':
          if (parametro.valorMaximo < valor) {
            aviso = true;
          }
          break;
        case '4':
          if (parametro.valorMaximo <= valor) {
            aviso = true;
          }
          break;
      }

      var result = {
        status: 'OK',
        acao: 0,
      };
      if (aviso && !enviou) {
        console.log('aviso ativo')
        switch (parametro.acaoId) {
          // Email
          case 1:
            emailService.sendEmail(usuario.email, parametro.descricao, `<p>Atenção! Seu sensor ${sensor.nome} ultrapassou os limites estabelicidos.</p>`);
            break;
            // Notificao
          case 2:
            var accountSid = 'AC7373bc6b787f770c828b7d03bdf2a958'; // Your Account SID from www.twilio.com/console
            var authToken = '9e5385f89ef5c7ce6731c049b1f61975'; // Your Auth Token from www.twilio.com/console

            var twilio = require('twilio');
            var client = new twilio(accountSid, authToken);

            client.messages.create({
                body: `Atenção! Seu sensor ${sensor.nome} ultrapassou os limites estabelicidos.`,
                to: usuario.telefone, // Text this number
                from: '+12342310601' // From a valid Twilio number
              })
              .then((message) => console.log(message.sid));
            break;
            // Desligar
          case 3:
            result = {
              status: 'OK',
              acao: 1,
            };
            break;
        }
        Acao.create({
          sensorId: sensor.id,
          acaoId: parametro.acaoId,
          data: new Date(),
          status: true
        }, (err, res) => {
          if (err) cb(err);
        });
      }
      cb(null, result);
    });
  };


  Logsensor.remoteMethod('sendInformation', {
    accepts: [{
        arg: 'guid',
        type: 'string',
        required: true,
      },
      {
        arg: 'valor',
        type: 'number',
        required: true,
      }
    ],
    returns: {
      arg: 'data',
      type: 'string',
    },
    http: {
      verb: 'post',
    },
  });

  Logsensor.observe('before save', (ctx, next) => {
    var Logsensor = app.models.Logsensor;
    if (ctx.isNewInstance) {
      ctx.instance.data = new Date();
    }
    next();
  });

  Logsensor.remoteMethod('sum', {
    accepts: [{
        arg: 'periodo',
        type: 'number',
        required: true,
      },
      {
        arg: 'sensorId',
        type: 'number',
        required: true,
      }
    ],
    returns: {
      arg: 'data',
      type: 'string',
    },
    http: {
      verb: 'post',
    },
  });

  Logsensor.sum = function (periodo, sensorId, cb) {
    var today = new Date(Date.now());
    var startDate = '';
    var endDate = '';
    var ds = Logsensor.dataSource;
    var params = [];
    var sql = ` select
                  sum(logsensor.valor)
                from
                  logsensor
                where data between $1 and $2 and sensorid = $3 and valido = true`;
    switch (periodo) {
      case 0:
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        break;
      case 1:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        break;
    }
    params.push(startDate);
    params.push(endDate);
    params.push(sensorId);
    ds.connector.query(sql, params, function (err, res) {
      if (err) console.error(err);
      cb(err, res);
    });
  }

  Logsensor.remoteMethod('reset', {
    accepts: [{
      arg: 'guid',
      type: 'string',
      required: true,
    }],
    returns: {
      arg: 'data',
      type: 'string',
    },
    http: {
      verb: 'post',
    },
  });

  Logsensor.reset = async function (guid, cb) {
    var Sensor = app.models.Sensor;
    var Acao = app.models.Acao;
    var sensor;

    // Busca a informacao do sensor
    await new Promise((resolve, reject) => {
      Sensor.find({
        where: {
          guid: guid,
        },
      }, (err, sensores) => {
        if (err) return reject(err);
        if (sensores.length === 0) {
          var error = new Error();
          error.message = 'Sensor não encontrado';
          error.status = 404;
          return reject(error);
        } else {
          sensor = JSON.parse(JSON.stringify(sensores[0]));
          resolve();
        }
      });
    });

    // Atualiza a info
    await new Promise((resolve, reject) => {
      Logsensor.updateAll({
        sensorId: sensor.id
      }, {
        valido: false
      }, function (err, items) {
        if (err) {
          return reject (err)
        } else {
          console.log('LogSensor ' + sensor.nome + ' resetado com sucesso!');
          resolve()
        }
      });
    });

     // Atualiza a info
     await new Promise((resolve, reject) => {
      Acao.updateAll({
        sensorId: sensor.id
      }, {
        status: false
      }, function (err, items) {
        if (err) {
          cb(err)
        } else {
          console.log('Acao ' + sensor.nome + ' resetado com sucesso!');
          cb(null)
        }
      });
    });
  }

  Logsensor.checkAcao = function(periodo, sensorId, cb) {
    // Verifica se ja enviou o aviso no periodo
    var today = new Date(Date.now());
    var startDate = '';
    var endDate = '';
    var ds = Logsensor.dataSource;
    var params = [];
    var sql = ` select
                        count(1)
                      from
                        acao
                      where data between $1 and $2 and sensorid = $3 and status = true`;
    switch (periodo) {
      case 0:
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        break;
      case 1:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        break;
    }
    params.push(startDate);
    params.push(endDate);
    params.push(sensorId);
    ds.connector.query(sql, params, function (err, res) {
      if (err) console.log(err);
      cb(null, res)
    });
  };

};
