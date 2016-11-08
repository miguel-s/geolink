'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/login',
    config: {
      description: 'Returns a login form',
      auth: { strategy: 'session', mode: 'try' },
      plugins: { 'hapi-auth-cookie': { redirectTo: false } },
      handler: require('../controllers/login.js'),
    },
  },
  {
    method: 'POST',
    path: '/login',
    config: {
      description: 'Returns a login form',
      auth: { strategy: 'session', mode: 'try' },
      plugins: { 'hapi-auth-cookie': { redirectTo: false } },
      validate: {
        payload: require('../models/user.js'),
        failAction: require('../controllers/login.js'),
      },
      handler: require('../controllers/login.js'),
    },
  },
  {
    method: 'GET',
    path: '/logout',
    config: {
      description: 'Logout user',
      handler: require('../controllers/logout.js'),
    },
  },
  {
    method: 'GET',
    path: '/signup',
    config: {
      description: 'Returns a sinup form',
      auth: { strategy: 'session', mode: 'try' },
      plugins: { 'hapi-auth-cookie': { redirectTo: false } },
      handler: require('../controllers/signup.js'),
    },
  },
  {
    method: 'POST',
    path: '/signup',
    config: {
      description: 'Returns a sinup form',
      auth: { strategy: 'session', mode: 'try' },
      plugins: { 'hapi-auth-cookie': { redirectTo: false } },
      validate: {
        payload: require('../models/user.js').schema,
        failAction: require('../controllers/signup.js'),
      },
      handler: require('../controllers/signup.js'),
    },
  },
];
