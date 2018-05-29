'use strict';
var uuid = require('uuid');

module.exports = function (Sensor) {

  Sensor.registerSensor = (data, cb) => {
    Sensor.create({
      tipo: data.tipo,
      guid: uuid.v4(),
      usuarioId: data.usuarioId,
      status: data.status,
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
