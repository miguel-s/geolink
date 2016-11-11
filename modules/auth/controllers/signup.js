'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const bcrypt = require('bcryptjs');

module.exports = function handler(request, reply, source, error) {
  if (request.method === 'get') return reply.view('signup');

  if (request.auth.isAuthenticated) return reply.redirect('/');

  if (process.env.DASHBOARDS_ALLOW_SIGNUP === 'false') {
    return reply.view('signup', {
      message: 'Signup not allowed',
      email: request.payload.email,
    });
  }

  if (!request.payload.email || !request.payload.password) {
    return reply.view('signup', {
      message: 'Missing email or password',
      email: request.payload.email,
    });
  }

  // Joi error handling
  if (error && error.data) {
    if (error.data.details[0].path === 'email') {
      return reply.view('signup', {
        message: 'Must be a valid email',
        email: request.payload.email,
      });
    }
    if (error.data.details[0].path === 'password') {
      return reply.view('signup', {
        message: 'Password must be at least 6 characters long',
        email: request.payload.email,
      });
    }
  }

  request.server.app.dblocal.get('SELECT * FROM Users WHERE email = ?', request.payload.email,
    (err, row) => {
      if (err) return reply(Boom.badImplementation());

      if (row) {
        return reply.view('signup', {
          message: 'User already exists',
          email: request.payload.email,
        });
      }

      bcrypt.genSalt(12, (err, salt) => {
        if (err) return reply(Boom.badImplementation());

        bcrypt.hash(request.payload.password, salt, (err, hash) => {
          if (err) return reply(Boom.badImplementation());

          const account = {
            id: uuid.v4(),
            username: null,
            password: hash,
            email: request.payload.email,
            scope: 'user',
          };

          request.server.app.db.run(
            'INSERT INTO Users (id, username, password, email, scope) VALUES (?, ?, ?, ?, ?)',
            account.id,
            account.username,
            account.password,
            account.email,
            account.scope,
            (err) => {
              if (err) return reply(Boom.badImplementation());

              const sid = uuid.v4();

              request.server.app.cache.set(sid, { account }, 0, (err) => {
                if (err) return reply(Boom.badImplementation(err));

                request.cookieAuth.set({ sid });

                return reply.redirect('/');
              });
            }
          );
        });
      });
    }
  );
};
