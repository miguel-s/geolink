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
  {
    method: 'GET',
    path: '/map',
    config: {
      description: 'Returns the map page',
      auth: { strategy: 'session', mode: 'try' },
      handler: require('./controllers/map.js'),
    },
  },
];
