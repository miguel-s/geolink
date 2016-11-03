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
    // Basic plugins
    {
      plugin: 'inert',
      options: {
        select: ['geolink'],
      },
    },
    {
      plugin: 'vision',
      options: {
        select: ['geolink'],
      },
    },
    {
      plugin: 'hapi-auth-cookie',
      options: {
        select: ['geolink'],
      },
    },
    {
      plugin: './good',
      options: {
        select: ['geolink'],
      },
    },
    {
      plugin: './database',
      options: {
        select: ['geolink'],
      },
    },

    // Modules
    {
      plugin: 'geolink-admin',
      options: {
        select: ['geolink'],
        routes: {
          prefix: '/admin',
        },
      },
    },
    {
      plugin: 'geolink-workers',
      options: {
        select: ['geolink'],
        routes: {
          prefix: '/workers',
        },
      },
    },
    {
      plugin: 'geolink-dashboards',
      options: {
        select: ['geolink'],
        routes: {
          prefix: '/dashboards',
        },
      },
    },
  ],
};
