'use strict';

module.exports = function (Parametro) {


  var methodNames = ['prototype.patchAttributes', 'createChangeStream', 'exists', 'patchOrCreate',
    'replace', 'replaceById', 'findOne', 'upsertWithWhere', 'count', 'replaceOrCreate',
    'prototype.__get__acoes', 'prototype.__create__acoes', 'prototype.__findById__acoes',
    'prototype.__updateById__acoes', 'prototype.__destroyById__acoes', 'prototype.__count__acoes',
    'prototype.__update__acoes', 'prototype.__destroy__acoes'
  ]

  methodNames.forEach(function (methodName) {
    Parametro.disableRemoteMethodByName(methodName);
  });
};
