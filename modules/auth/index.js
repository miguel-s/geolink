'use strict';

const Hoek = require('hoek');

const internals = {};

exports.register = (server, options, next) => {
  server.dependency(['authCookie'], internals.after);
  return next();
};

exports.register.attributes = {
  name: 'auth',
};

exports.options = internals.options = {

};

internals.after = (server, next) => {
  server.views({
    engines: {
      pug: {
        module: require('pug'),
        isCached: process.env.NODE_ENV === 'production',
      },
    },
    relativeTo: __dirname,
    path: 'views',
  });

  server.route(require('./plugins/routes.js'));

  return next();
};
