'use strict';

const Glue = require('glue');
const Hoek = require('hoek');

exports.init = (manifest, options, next) => {
  Glue.compose(manifest, options, (err, server) => {
    Hoek.assert(!err, err);

    server.start(err => next(err, server));
  });
};
