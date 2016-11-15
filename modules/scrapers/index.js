'use strict';

const socketio = require('socket.io');
const sockets = require('./sockets.js');

const internals = {};

exports.register = (server, options, next) => {
  server.dependency(['authCookie'], internals.after);
  return next();
};

exports.register.attributes = {
  name: 'scrapers',
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

  const io = socketio(server.listener);
  sockets(io);

  return next();
};

