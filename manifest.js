'use strict';

module.exports = {
  connections: [
    {
      port: process.env.GEOLINK_PORT,
      labels: ['geolink'],
      router: {
        stripTrailingSlash: true,
      },
    },
  ],
  registrations: [
    // Plugins
    { plugin: 'vision' },
    { plugin: './plugins/auth-cookie' },
    { plugin: './plugins/static' },
    { plugin: './plugins/good' },
    { plugin: './plugins/database-local' },
    { plugin: './plugins/database-remote' },

    // Modules
    {
      plugin: './modules/admin',
      options: {
        routes: {
          prefix: '/admin',
        },
      },
    },
    {
      plugin: './modules/auth',
      options: {
        routes: {
          prefix: '/auth',
        },
      },
    },
    {
      plugin: './modules/scrapers',
      options: {
        routes: {
          prefix: '/scrapers',
        },
      },
    },
    {
      plugin: './modules/dashboards',
      options: {
        routes: {
          prefix: '/dashboards',
        },
      },
    },
  ],
};
