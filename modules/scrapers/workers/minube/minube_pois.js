'use strict';

const database = require('mssql');
const _ = require('lodash');
const xray = require('x-ray');

const run = require('../runner.js');
const model = require('./model_pois.js');

// Set up config

const origin = 'minube';
const list = 'pois';
const size = 1;

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
  FROM ibc_seg.DM_SOURCE_MINUBE_LIST_RAW`)
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
      const scrape = x(url, 'body',
        {
          name: '.text_title',
          rating: '.mnormal:nth-child(3)',
          numRatings: '.mnormal:nth-child(5)',
          // numFotos: '.num_pictures', -> data gets loaded async, not possible to parse
          numOpinions: '.gridContainer.not-mobile',
          telephone: '.phone .text',
          address: '.address .text',
          latlon: '.address a@onclick',
          webpage: '.web .text',
        }
      );

      scrape((err, arr) => {
        if (err) reject(err);
        else resolve(arr);
      });
    })
    .catch(error => ({ error, source: 'handleGet' }));
  }

  function handleResponse(item, response, done) {
    const { cluster, section } = item;
    const datetime = new Date().toISOString();

    let result = response;

    // last opportunity to modify response objects
    result.id = item.id;
    result.url = item.url;
    result.city = item.city;
    result.saved = item.saved;

    if (response.numOpinions) {
      result.numOpinions = response.numOpinions
        .slice(0, response.numOpinions.indexOf('opiniones'))
        .slice(0, response.numOpinions.indexOf('opinión'))
        .trim();
    }

    if (response.latlon) {
      const latlon = result.latlon.split(',');
      if (latlon.length >= 3) {
        result.lat = latlon[1];
        result.lon = latlon[2].replace(');', '');
      }
    }

    result = _.merge({}, model, result, { cluster, section, datetime });

    if (done.indexOf(result.id.toString()) === -1) return [result];
    return [];

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
