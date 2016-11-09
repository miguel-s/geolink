'use strict';

const mssql = require('mssql');

const internals = {};

exports.options = internals.options = {
  user: process.env.CSADB_USER,
  password: process.env.CSADB_PASSWORD,
  server: process.env.CSADB_SERVER,
  database: process.env.CSADB_DATABASE,
  connectionTimeout: process.env.CSADB_CONNECTION_TIMEOUT,
  requestTimeout: process.env.CSADB_REQUEST_TIMEOUT,
};

exports.register = (server, options, next) => {
  server.ext('onPreStart', (request, reply) => {
    mssql.connect(internals.options).catch(err => console.error(err));
    server.app.dbremote = mssql;
    return reply();
  });

  server.ext('onPreStop', (request, reply) => {
    if (!server.app.dbremote) return reply();
    server.app.dbremote.close();
    return reply();
  });
  return next();
};

exports.register.attributes = {
  name: 'databseRemote',
};
