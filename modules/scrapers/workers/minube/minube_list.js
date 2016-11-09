'use strict';

const database = require('mssql');
const _ = require('lodash');
const xray = require('x-ray');

const run = require('../runner.js');
const model = require('./model_list.js');

// Set up config

const origin = 'minube';
const list = 'list';
const size = 40;

// Set up input data

const dbConfig = {
  user: process.env.CSADB_USER,
  password: process.env.CSADB_PASSWORD,
  server: process.env.CSADB_SERVER,
  database: process.env.CSADB_DATABASE,
  requestTimeout: process.env.CSADB_REQUEST_TIMEOUT,
};

database.connect(dbConfig)
.then(() => database.query`
  SELECT *
  FROM ibc_seg.DM_SOURCE_MINUBE_PAGES_RAW`)
.then((rows) => {
  const input = rows
    .map((item) => Object.assign({}, item, {
      name: item.id,
      cluster: item.id,
      section: null,
    }));

  // Set up handlers

  function handleGet({ url }) {
    const x = xray();

    return new Promise((resolve, reject) => {
      const scrape = x(url, '.poi_item',
        [{
          id: '@id',
          url: 'a@href',
          name: 'a',
          city: '.city_description',
          saved: '.saved_info',
        }]
      );

      scrape((err, arr) => {
        if (err) reject(err);
        else resolve(arr);
      });
    })
    .catch(error => ({ error, source: 'handleGet' }));
  }

  function handleResponse(item, response, done) {
    const { city, cluster, section } = item;
    const datetime = new Date().toISOString();

    return response
      .map((row) => {
        // last opportunity to modify response objects
        const newRow = row;

        newRow.name = row.name ? row.name.trim() : null;
        newRow.city = row.city ? row.city.trim() : null;
        newRow.saved = row.saved ? row.saved.replace('lo guardaron', '').trim() : null;

        return newRow;
      })
      .map((row, index) => _.merge({}, model, row, { city, cluster, section, index, datetime }))
      .filter(row => done.indexOf(row.id.toString()) === -1)
      .filter((row, index, array) => array.slice(0, index).map(row => row.id).indexOf(row.id) === -1);

    // return { error: response.meta, source: 'handleResponse' };
  }

  // Run

  run({
    config: { origin, list, size },
    data: { input, model },
    handlers: { handleGet, handleResponse },
  });
})
.catch(err => console.log(err));
