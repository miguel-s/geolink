'use strict';

const path = require('path');
const Hoek = require('hoek');

const internals = {};

exports.register = (server, options, next) => {
  server.dependency('authCookie', internals.after);
  server.register(require('inert'), (err) => {
    Hoek.assert(!err, err);
    return next();
  });
};

exports.register.attributes = {
  name: 'static',
};

internals.after = (server, next) => {
  server.route([
    // Images
    {
      method: 'GET',
      path: '/img/{path*}',
      config: {
        description: 'Images',
        auth: { strategy: 'session', mode: 'try' },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } },
        handler: {
          directory: {
            path: path.join(__dirname, '../public/img'),
          },
        },
      },
    },

    // Scripts
    {
      method: 'GET',
      path: '/js/{path*}',
      config: {
        description: 'Scripts',
        auth: { strategy: 'session', mode: 'try' },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } },
        handler: {
          directory: {
            path: path.join(__dirname, '../public/js'),
          },
        },
      },
    },

    // Styles
    {
      method: 'GET',
      path: '/css/{path*}',
      config: {
        description: 'Stylesheets',
        auth: { strategy: 'session', mode: 'try' },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } },
        handler: {
          directory: {
            path: path.join(__dirname, '../public/css'),
          },
        },
      },
    },

    // Libs
    {
      method: 'GET',
      path: '/libs/{path*}',
      config: {
        description: 'Libs',
        auth: { strategy: 'session', mode: 'try' },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } },
        handler: {
          directory: {
            path: path.join(__dirname, '../public/libs'),
          },
        },
      },
    },
  ]);

  return next();
};
