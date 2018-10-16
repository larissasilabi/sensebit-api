'use strict';
var app = require('../../server/server');

module.exports = function (Parametro) {


  var methodNames = ['prototype.patchAttributes', 'createChangeStream', 'exists',
    'replace', 'replaceById', 'findOne', 'upsertWithWhere', 'count', 'replaceOrCreate',
    'prototype.__get__acoes', 'prototype.__create__acoes', 'prototype.__findById__acoes',
    'prototype.__updateById__acoes', 'prototype.__destroyById__acoes', 'prototype.__count__acoes',
    'prototype.__update__acoes', 'prototype.__destroy__acoes'
  ]

  methodNames.forEach(function (methodName) {
    Parametro.disableRemoteMethodByName(methodName);
  });

  Parametro.remoteMethod('findBySensor', {
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
      verb: 'get',
    },
  });

  Parametro.findBySensor = function (guid, cb) {
    var Sensor = app.models.Sensor;
    var sensor, parametro;

    // Busca a informacao do sensor
    Sensor.find({
      where: {
        guid: guid,
      },
      include: 'parametros'
    }, (err, sensores) => {
      if (err) return reject(err);
      if (sensores.length === 0) {
        var error = new Error();
        error.message = 'Sensor não encontrado';
        error.status = 404;
        return cb(error);
      } else {
        sensor = JSON.parse(JSON.stringify(sensores[0]));
        parametro = sensor.parametros;
        cb(null, parametro);
      }
    });
  }
};
