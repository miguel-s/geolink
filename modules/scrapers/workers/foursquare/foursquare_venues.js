'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const fetch = require('node-fetch');

const run = require('../runner.js');
const model = require('./model_venues.js');

// Set up config

const origin = 'foursquare';
const list = 'venues';
const size = 5;
const apiConfig = {
  api: process.env.FOURSQUARE_API,
  id: process.env.FOURSQUARE_ID,
  secret: process.env.FOURSQUARE_SECRET,
};

// Set up input data

const centroidesCodCensal = JSON.parse(fs.readFileSync(path.join(__dirname, './input/centroides_cod_censal.json')));
const centroidesCodPostal = JSON.parse(fs.readFileSync(path.join(__dirname, './input/centroides_cod_postal.json')));
const centroidesMunicipio = JSON.parse(fs.readFileSync(path.join(__dirname, './input/centroides_municipio.json')));
const centroids = [...centroidesCodCensal, ...centroidesCodPostal, ...centroidesMunicipio];

const food = centroids
  .map((item) => Object.assign({}, item, {
    offset: 0,
    name: `${item.latlon} | ${item.municipio} | ${item.type} | food`,
    cluster: `${item.latlon} | ${item.municipio} | ${item.type} | food`,
    section: 'food',
  }));
const drinks = centroids
  .map((item) => Object.assign({}, item, {
    offset: 0,
    name: `${item.latlon} | ${item.municipio} | ${item.type} | drinks`,
    cluster: `${item.latlon} | ${item.municipio} | ${item.type} | drinks`,
    section: 'drinks',
  }));
const coffee = centroids
  .map((item) => Object.assign({}, item, {
    offset: 0,
    name: `${item.latlon} | ${item.municipio} | ${item.type} | coffee`,
    cluster: `${item.latlon} | ${item.municipio} | ${item.type} | coffee`,
    section: 'coffee',
  }));

const input = [...food, ...drinks, ...coffee];

// Set up handlers

function handleGet({ offset, latlon, section }) {
  const { api, id, secret } = apiConfig;
  const url = `${api}?ll=${latlon}&section=${section}&openNow=0&limit=50&offset=${offset}&client_id=${id}&client_secret=${secret}&v=20160122`;
  return fetch(url)
    .then(res => res.json())
    .catch(error => ({ error, source: 'handleGet' }));
}

function handleResponse(item, response, done) {
  const { cluster, section } = item;
  const datetime = new Date().toISOString();

  if (response.meta.code === 200) {
    const pages = [];
    let numPages = 1;

    if (response.response.totalResults > 50 && item.offset === 0) {
      numPages = Math.ceil(response.response.totalResults / 50);

      for (let i = 1; i < numPages; i++) {
        const temp = Object.assign({}, item);
        temp.offset = i * 50;
        pages.push(temp);
      }
    }

    const rows = response.response.groups[0].items
      .map(row => row.venue)
      .filter(row => done.indexOf(row.id.toString()) === -1);

    if (rows.length) {
      const result = rows
        .map((row) => {
          // last opportunity to modify response objects
          const newRow = row;

          // only save event ids
          if (newRow.events && newRow.events.items) {
            newRow.events.items = row.events.items.map(event => event.id);
          }

          return newRow;
        })
        .map((row, index) => _.merge({}, model, row, { cluster, section, index, datetime }));

      if (numPages > 1) return { result, pages };
      return result;
    }

    if (numPages > 1) return { result: [], pages };
    const id = `empty_centroid (${cluster})`;
    return [_.merge({}, model, { id, cluster, section, index: null, datetime })];
  }

  return { error: response.meta, source: 'handleResponse' };
}

// Run

run({
  config: { origin, list, size },
  data: { input, model },
  handlers: { handleGet, handleResponse },
});
