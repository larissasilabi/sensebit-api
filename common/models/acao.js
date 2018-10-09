'use strict';

module.exports = function(Acao) {

  var methodNames = ['prototype.patchAttributes', 'createChangeStream', 'exists', 'patchOrCreate',
    'replace', 'replaceById', 'findOne', 'upsertWithWhere', 'count', 'replaceOrCreate', 'updateAll',
    'prototype.__get__logAcoes', 'prototype.__create__logAcoes', 'prototype.__findById__logAcoes',
    'prototype.__updateById__logAcoes', 'prototype.__destroyById__logAcoes', 'prototype.__count__logAcoes',
    'prototype.__update__logAcoes', 'prototype.__destroy__logAcoes', 'prototype.__delete__logAcoes',
    , 'prototype.__exists__logAcoes', , 'prototype.__link__logAcoes', , 'prototype.__unlink__logAcoes'
  ]

  methodNames.forEach(function (methodName) {
    Acao.disableRemoteMethodByName(methodName);
  });
};
