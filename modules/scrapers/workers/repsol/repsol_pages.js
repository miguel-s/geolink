'use strict';

const _ = require('lodash');
const xray = require('x-ray');

const run = require('../runner.js');
const model = require('./model_pages.js');

// Set up config

const origin = 'repsol';
const list = 'pages';
const size = 215;

// Set up input data

const input = [{
  url: 'http://www.guiarepsol.com/es/gastronomia/restaurantes/',
  name: 'Pages',
  cluster: 1,
  section: null,
}];

// Set up handlers

function handleGet({ url }) {
  const x = xray();

  return new Promise((resolve, reject) => {
    const scrape = x(url, '.pagination', ['a']);

    scrape((err, arr) => {
      if (err) reject(err);
      else {
        const urls = [];
        const pages = parseInt(arr[arr.length - 2], 10);
        for (let i = 1; i <= pages; i++) {
          urls.push(`http://www.guiarepsol.com/es/gastronomia/restaurantes?page=${i}`);
        }
        resolve(urls);
      }
    });
  })
  .catch(error => ({ error, source: 'handleGet' }));
}

function handleResponse(item, response, done) {
  const { cluster, section } = item;
  const datetime = new Date().toISOString();

  return response
    .map((row, index) => {
      // last opportunity to modify response objects
      const newRow = { url: row };

      newRow.id = index + 1;

      return newRow;
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
