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

  Logsensor.sendInformation = function (guid, valor, cb) {
    var Sensor = app.models.Sensor;
    Sensor.find({
      where: {
        guid: guid,
      },
      include: ['parametros', 'usuario'],
    }, (err, sensor) => {
      if (err) cb(err);
      if (sensor.length === 0) {
        var error = new Error();
        error.message = 'Sensor não encontrado';
        error.status = 404;
        cb(error);
      } else {
        Logsensor.create({
          sensorId: sensor[0].id,
          valor: valor,
        }, (err) => {
          if (err) {
            cb(err, sensor);
          } else {
            var Sensor = app.models.Sensor;
            var parametro, usuario;
            sensor = JSON.parse(JSON.stringify(sensor[0]));
            parametro = sensor.parametros;
            usuario = sensor.usuario;
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
          }

          var result = {
            status: 'OK',
            acao: 0,
          };
          if (aviso) {
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
          }
          cb(null, result);
        });
      };
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

};
