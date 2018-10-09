'use strict';

module.exports = function(Usuario){

  var methodNames = ['prototype.patchAttributes', 'createChangeStream', 'exists', 'patchOrCreate',
    'replace', 'replaceById', 'findOne', 'upsertWithWhere', 'confirm', 'count', 'replaceOrCreate', 'resetPassword', 'setPassword', 'updateAll',
    'prototype.__get__accessTokens', 'prototype.__create__accessTokens', 'prototype.__findById__accessTokens',
    'prototype.__updateById__accessTokens', 'prototype.__destroyById__accessTokens', 'prototype.__count__accessTokens',
    'prototype.__delete__accessTokens', 'prototype.verify'];

  methodNames.forEach(function (methodName) {
    Usuario.disableRemoteMethodByName(methodName);
  });
};
