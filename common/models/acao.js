'use strict';

module.exports = function(Acao) {

  var methodNames = ['prototype.patchAttributes', 'createChangeStream', 'exists', 'patchOrCreate',
    'replace', 'replaceById', 'findOne', 'upsertWithWhere', 'count', 'replaceOrCreate', 'updateAll']

  methodNames.forEach(function (methodName) {
    Acao.disableRemoteMethodByName(methodName);
  });

};
