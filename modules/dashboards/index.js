'use strict';

const Hoek = require('hoek');

const internals = {};

exports.register = (server, options, next) => {
  server.dependency(['authCookie'], internals.after);
  return next();
};

exports.register.attributes = {
  name: 'dashboards',
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
    context: request => ({
      user: request.auth.credentials,
    }),
  });

  server.route(require('./routes.js'));

  return next();
};

