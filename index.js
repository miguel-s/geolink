'use strict';

require('dotenv').config();

const Hoek = require('hoek');
const Server = require('./server.js');
const manifest = require('./manifest.js');

const options = { relativeTo: `${__dirname}/` };

Server.init(manifest, options, (err, server) => {
  Hoek.assert(!err, err);

  server.connections.forEach((connection) => {
    const labels = connection.settings.labels.join(', ');
    const port = connection.settings.port;
    console.log(`[${labels}] connection started at port [${port}]`);
  });
});
