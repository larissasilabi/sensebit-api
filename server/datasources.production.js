'use strict';

console.log('### database production');

module.exports = {
  postgres: {
    connector: 'postgresql',
    hostname: 'ec2-52-38-128-216.us-west-2.compute.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'sensebit',
  },
};
