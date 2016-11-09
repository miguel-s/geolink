'use strict';

const database = require('mssql');
const _ = require('lodash');
const xray = require('x-ray');

const run = require('../runner.js');
const model = require('./model_venues.js');

// Set up config

const origin = 'repsol';
const list = 'venues';
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
  FROM ibc_seg.DM_SOURCE_REPSOL_LIST_RAW`)
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
      const scrape = x(url, '.restaurant',
        {
          name: '.title-area h1',
          map: '.bb-show-map@href',
          rating: ['.rating li img@alt'],
          address: '.address-t-record',
          telephone: '.info-t-record strong',
          email: '.bb-contact span:nth-child(2)',
          webpage: '.bb-contact a@href',
          // price: x('.highlighted-box-right p:not(".download")',
          //           [{
          //             priceLabel: '.left',
          //             priceAmount: '.right',
          //           }]),
          // schedule: ['.extra-info.schedule p'],
          // details: x('#bb-tab-1 .data',
          //             [{
          //               detailLabel: '.first',
          //               detailText: '.second',
          //             }]),
          // specialties: x('#bb-tab-2 .data',
          //                 [{
          //                   specialtyLabel: '.first',
          //                   specialtyText: '.second',
          //                 }]),
          // services: ['.fullservices .icon img@alt'],
          // valoration: x('.tr-valorations .valoration-case',
          //               [{
          //                 valorationLabel: '.first p',
          //                 valorationText: '.valoration img@alt',
          //               }]),
          // tags: ['.tourist-record li'],
        });

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

    if (response.rating) {
      if (response.rating.indexOf('Te recomendamos') === -1) result.rating = response.rating.length;
      else result.rating = 'R';
    }
    if (response.address) {
      result.address = response.address.replace('Ver mapa', '').replace(/\n/g, '').trim();
    }
    if (response.email) {
      result.email = response.email.replace(/\n/g, '').trim();
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

