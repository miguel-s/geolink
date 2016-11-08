'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      description: 'Returns the index page',
      handler: {
        view: {
          template: 'index',
        },
      },
    },
  },
];
