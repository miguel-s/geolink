'use strict';

const Glue = require('glue');
const Hoek = require('hoek');

exports.init = (manifest, options, next) => {
  Glue.compose(manifest, options, (err, server) => {
    Hoek.assert(!err, err);

    server.ext('onPreResponse', (request, reply) => {
      if (!request.response.isBoom) {
        return reply.continue();
      }
      return reply.view('error', request.response).code(request.response.output.statusCode);
    });

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

    server.route([
      {
        method: 'GET',
        path: '/',
        config: {
          description: 'Returns the index page',
          auth: { strategy: 'session', mode: 'try' },
          handler: {
            view: 'index',
          },
        },
      },
    ]);

    server.start(err => next(err, server));
  });
};
