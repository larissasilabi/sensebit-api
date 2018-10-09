'use strict';

module.exports = function(Logacao) {

  var methodNames = ['prototype.patchAttributes', 'createChangeStream', 'exists', 'patchOrCreate',
    'replace', 'replaceById', 'findOne', 'upsertWithWhere', 'count', 'replaceOrCreate', 'updateAll']

  methodNames.forEach(function (methodName) {
    Logacao.disableRemoteMethodByName(methodName);
  });

};
