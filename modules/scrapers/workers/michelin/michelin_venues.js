'use strict';

const database = require('mssql');
const _ = require('lodash');
const xray = require('x-ray');

const run = require('../runner.js');
const model = require('./model_venues.js');

// Set up config

const origin = 'michelin';
const list = 'venues';
const size = 25;

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
  FROM ibc_seg.DM_SOURCE_MICHELIN_LIST_RAW
  ORDER BY CAST(cluster AS INT)`)
.then((rows) => {
  const input = rows
    .map((item) => Object.assign({}, item, {
      name: `Page: ${item.id}`,
      cluster: item.id,
      section: null,
    }));

  // Set up handlers

  function handleGet({ url }) {
    const x = xray();

    return new Promise((resolve, reject) => {
      const scrape = x(url, '.poi-item',
        [{
          name: '.poi-item-name a',
          url: '.poi-item-name a@href',
          stars: ['.poi-item-stars .star@class'],
          bib: '.poi-item-stars .bib-gourmand@class',
          priceMin: '.poi-item-price em:first-child',
          priceMax: '.poi-item-price em:last-child',
          address: '.poi-item-address',
        }])
        .paginate('.pagination-current-page + a@href');

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

    return response
      .map((row) => {
        // last opportunity to modify response objects
        const addressParts = row.address.split(', ');
        const streetAndNumber = addressParts[0];
        const postalCodeAndMunicipality = addressParts[addressParts.length - 1];
        const municipality = postalCodeAndMunicipality
                              .slice(postalCodeAndMunicipality.indexOf(' ') + 1);
        const postalCode = postalCodeAndMunicipality
                            .slice(0, postalCodeAndMunicipality.indexOf(' '));
        const street = streetAndNumber.slice(0, streetAndNumber.search(/\d/));
        const number = streetAndNumber.match(/\d+/) ? streetAndNumber.match(/\d+/)[0] : null;

        return {
          id: row.url.replace('http://www.viamichelin.es/web/Restaurante/', ''),
          url: row.url,
          name: row.name,
          address: row.address,
          stars: row.stars ? `${row.stars.length}` : '0',
          bib: row.bib ? '1' : '0',
          priceMin: row.priceMin,
          priceMax: row.priceMax,
          municipality,
          postalCode,
          street,
          number,
        };
      })
      .map((row, index) => _.merge({}, model, row, { cluster, section, index, datetime }))
      .filter(row => done.indexOf(row.id.toString()) === -1);

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

