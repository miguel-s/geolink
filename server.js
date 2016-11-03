'use strict';

const Glue = require('glue');

exports.init = (manifest, options, next) => {
  Glue.compose(manifest, options, (err, server) => {
    if (err) return next(err);

    server.start(err => next(err, server));
  });
};
