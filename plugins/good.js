'use strict';

const Hoek = require('hoek');

const internals = {};

internals.dev = {
  ops: {
    interval: 30000,
  },
  reporters: {
    res: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ log: '*', response: '*' }],
    }, {
      module: 'good-console',
    }, 'stdout'],
  },
};

internals.prod = {
  ops: {
    interval: 30000,
  },
  reporters: {
    ops: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ ops: '*' }],
    }, {
      module: 'good-squeeze',
      name: 'SafeJson',
      args: [
        null,
        { separator: ',' },
      ],
    }, {
      module: 'rotating-file-stream',
      args: [
        'ops',
        {
          size: '10MB',
          path: './logs',
        },
      ],
    }],
    log: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ log: '*' }],
    }, {
      module: 'good-squeeze',
      name: 'SafeJson',
      args: [
        null,
        { separator: ',' },
      ],
    }, {
      module: 'rotating-file-stream',
      args: [
        'log',
        {
          size: '10MB',
          path: './logs',
        },
      ],
    }],
    res: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ response: '*' }],
    }, {
      module: 'good-squeeze',
      name: 'SafeJson',
      args: [
        null,
        { separator: ',' },
      ],
    }, {
      module: 'rotating-file-stream',
      args: [
        'res',
        {
          size: '10MB',
          path: './logs',
        },
      ],
    }],
    err: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ error: '*' }],
    }, {
      module: 'good-squeeze',
      name: 'SafeJson',
      args: [
        null,
        { separator: ',' },
      ],
    }, {
      module: 'rotating-file-stream',
      args: [
        'err',
        {
          size: '10MB',
          path: './logs',
        },
      ],
    }],
  },
};

internals.options = process.env.NODE_ENV === 'production' ? internals.prod : internals.dev;

exports.register = (server, options, next) => {
  server.register({ register: require('good'), options: internals.options }, (err) => {
    Hoek.assert(!err, err);
    return next();
  });
};

exports.register.attributes = {
  name: 'goodConfig',
};

exports.options = internals.options;
