'use strict';

const sqlite = require('sqlite3').verbose();

const internals = {};

exports.register = (server, options, next) => {
  server.ext('onPreStart', (request, reply) => {
    server.app.dblocal = new sqlite.Database('database.db');
    return reply();
  });

  server.ext('onPreStop', (request, reply) => {
    if (!server.app.dblocal) return reply();
    server.app.dblocal.close((err) => {
      if (err) return reply(err);
      return reply();
    });
  });
  return next();
};

exports.register.attributes = {
  name: 'databaseLocal',
};
