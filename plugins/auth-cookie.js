'use strict';

const Hoek = require('hoek');

const internals = {};

exports.register = (server, options, next) => {
  server.register(require('hapi-auth-cookie'), (err) => {
    Hoek.assert(!err, err);

    server.app.cache = server.cache(internals.options.cacheOptions);
    server.auth.strategy('session', 'cookie', false, {
      password: internals.options.password, // must be length 32 hapi v13 requirement.
      cookie: internals.options.cookie,
      redirectTo: internals.options.redirectTo,
      appendNext: internals.options.appendNext,
      isSecure: internals.options.isSecure,
      validateFunc: (request, session, callback) => {
        server.app.cache.get(session.sid, (err, cached) => {
          if (err) return callback(err, false);
          if (!cached) return callback(null, false); // session expired exception.

          return callback(null, true, cached.account);
        });
      },
    });

    return next();
  });
};

exports.register.attributes = {
  name: 'authCookie',
};

exports.options = internals.options = {
  cacheOptions: { segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 },
  password: process.env.COOKIE_SECRET,
  cookie: 'sid',
  redirectTo: '/login',
  appendNext: true,
  isHttpOnly: true,
  isSecure: process.env.NODE_ENV === 'production',
};
