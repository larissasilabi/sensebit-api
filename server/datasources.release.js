'use strict';

console.log('### database release');

module.exports = {
  postgres: {
    connector: 'postgresql',
    hostname: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'sensebit',
  },
};
