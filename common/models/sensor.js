'use strict';
var uuid = require('uuid');
var app = require('../../server/server');
module.exports = function (Sensor) {

  var methodNames = ['prototype.patchAttributes', 'createChangeStream', 'exists', 'patchOrCreate',
    'replace', 'replaceById', 'findOne', 'upsertWithWhere', 'count', 'replaceOrCreate',
    'prototype.__get__logAcoes', 'prototype.__create__logAcoes', 'prototype.__findById__logAcoes',
    'prototype.__updateById__logAcoes', 'prototype.__destroyById__logAcoes', 'prototype.__count__logAcoes',
    'prototype.__delete__logAcoes', 'prototype.__exists__logAcoes', 'prototype.__link__logAcoes', 'prototype.__unlink__logAcoes',
    'prototype.__get__logSensores', 'prototype.__create__logSensores', 'prototype.__findById__logSensores',
    'prototype.__updateById__logSensores', 'prototype.__destroyById__logSensores', 'prototype.__count__logSensores',
    'prototype.__delete__logSensores', 'prototype.__exists__logSensores', 'prototype.__link__logSensores', 'prototype.__unlink__logSensores',
    'prototype.__get__parametros', 'prototype.__create__parametros', 'prototype.__findById__parametros', 'prototype.__update__parametros', 'prototype.__destroy__parametros'
  ];

  methodNames.forEach(function (methodName) {
    Sensor.disableRemoteMethodByName(methodName);
  });

  Sensor.registerSensor = (data, cb) => {
    Sensor.create({
      tipo: data.tipo,
      guid: uuid.v4(),
      usuarioId: data.usuarioId,
      status: data.status,
      nome: data.nome,
    }, (err, pagamento) => {
      if (err) cb(err);
      if (pagamento) {
        cb(null, pagamento);
      };
    });
  };

  Sensor.remoteMethod('registerSensor', {
    accepts: [{
      arg: 'data',
      type: 'Object',
      required: true,
    }],
    returns: {
      arg: 'status',
      type: 'string',
    },
    http: {
      verb: 'post',
    },
  });
};
