'use strict';

module.exports = function updateCustomModels(app, next) {
    // Do not run when server was started via migrate.js
  if (require.main.filename.endsWith('migrate.js')) {
    return next();
  }

  const models = ['RoleMapping', 'Role', 'acao', 'logSensor', 'parametro', 'sensor', 'usuario'];

    // reference to our datasource
  const postgres = app.dataSources.postgres;

  postgres.autoupdate(models, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Models migration successful!');
    next();
  });
      // check to see if the model is out of sync with DB
  // postgres.isActual(models, (err, actual) => {
  //   if (err) {
  //     throw err;
  //   }

  //   let syncStatus = actual ? 'in sync' : 'out of sync';

  //   console.log(`Models are ${syncStatus}`);

  //   if (actual) return next();

  //   console.log('Migrating Models...');
  // });
};
