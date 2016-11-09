'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      description: 'Returns the index page',
      auth: { strategy: 'session', mode: 'try' },
      handler: require('./controllers/index.js'),
    },
  },
];
