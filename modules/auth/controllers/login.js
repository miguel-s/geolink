'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const bcrypt = require('bcryptjs');

module.exports = function handler(request, reply, source, error) {
  if (request.method === 'get') return reply.view('login');

  const next = request.payload.next || '/';

  if (request.auth.isAuthenticated) return reply.redirect(next);

  if (!request.payload.email || !request.payload.password) {
    return reply.view('login', {
      message: 'Missing email or password',
      email: request.payload.email,
    });
  }

  // Joi error handling
  if (error && error.data) {
    if (error.data.details[0].path === 'email') {
      return reply.view('login', {
        message: 'Must be a valid email',
        email: request.payload.email,
      });
    }
  }

  request.server.app.db.get('SELECT * FROM Users WHERE email = ?', request.payload.email,
    (err, row) => {
      if (err) return reply(Boom.badImplementation());

      if (!row) {
        return reply.view('login', {
          message: 'Invalid email or password',
          email: request.payload.email,
        });
      }

      bcrypt.compare(request.payload.password, row.password, (err, res) => {
        if (err) return reply(Boom.badImplementation());

        if (!res) {
          return reply.view('login', {
            message: 'Invalid email or password',
            email: request.payload.email,
          });
        }

        const sid = uuid.v4();
        const account = {
          id: row.id,
          username: row.username,
          email: row.email,
          scope: row.scope.split(', '),
        };

        request.server.app.cache.set(sid, { account }, 0, (err) => {
          if (err) return reply(Boom.badImplementation(err));

          request.cookieAuth.set({ sid });

          return reply.redirect(next);
        });
      });
    }
  );
};
