'use strict';

const Glue = require('glue');
const Hoek = require('hoek');

exports.init = (manifest, options, next) => {
  Glue.compose(manifest, options, (err, server) => {
    Hoek.assert(!err, err);

    server.route([
      {
        method: 'GET',
        path: '/',
        config: {
          description: 'Returns the index page',
          auth: { strategy: 'session', mode: 'try' },
          handler: function(request, reply) {
            reply.redirect('/dashboards');
          },
        },
      },
    ]);

    server.start(err => next(err, server));
  });
};
