'use strict';

const fs = require('fs');
const path = require('path');
const database = require('mssql');
const _ = require('lodash');
const fetch = require('node-fetch');

const run = require('../runner.js');
const model = require('./model_venues.js');

// Set up config

const origin = 'facebook';
const list = 'venues';
const size = 1;
const apiConfig = {
  accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
  api: 'https://graph.facebook.com/v2.6',
  fields: ['id', 'name', 'username', 'fan_count'],
  format: 'json',
};

// Set up input data

const dbConfig = {
  user: process.env.CSADB_USER,
  password: process.env.CSADB_PASSWORD,
  server: process.env.CSADB_SERVER,
  database: process.env.CSADB_DATABASE,
  requestTimeout: process.env.CSADB_REQUEST_TIMEOUT,
};

database.connect(dbConfig)
.then(() => {
  const pFoursquare = database.query`
    SELECT DISTINCT [contact.facebookUsername]
    FROM [ibc_seg].[V_SOURCE_FOURSQUARE]
    WHERE [contact.facebookUsername] IS NOT NULL`;
  const pManpower = database.query`
    SELECT DISTINCT [idFacebook]
    FROM [ibc_seg].[V_SOURCE_FACEBOOK_MANPOWER]
    WHERE [idFacebook] <> ''`;

  return Promise.all([pFoursquare, pManpower]);
})
.then((values) => {
  const foursquare = values[0].map(row => row['contact.facebookUsername']);
  const manpower = values[1].map(row => row.idFacebook);

  const once = JSON.parse(fs.readFileSync(path.join(__dirname, './input/11870.json')));
  const buscor = JSON.parse(fs.readFileSync(path.join(__dirname, './input/buscorestaurantes.json')));
  const manual = JSON.parse(fs.readFileSync(path.join(__dirname, './input/manual.json')));

  const input = [...foursquare, ...once, ...buscor, ...manpower, ...manual]
    .map((item) => Object.assign({ original: item }, {
      name: item,
      cluster: item,
      section: null,
    }));

  // Set up handlers

  function handleGet({ original }) {
    const { api, fields, accessToken, format } = apiConfig;
    const url = `${api}/${original}?fields=${fields.join('%2C')}&access_token=${accessToken}&format=${format}`;
    return fetch(url)
      .then(res => res.json())
      .catch(error => ({ error, source: 'handleGet' }));
  }

  function handleResponse(item, response, done) {
    const { cluster, section } = item;
    const datetime = new Date().toISOString();
    let result = {};

    if (response.error) {
      result = {
        id: cluster,
        err_code: response.error.code,
        err_message: response.error.message,
      };
      if (response.error.code === 21) {
        result.migrated = response.error.message.match(/^\d+|\d+\b|\d+(?=\w)/g)[1];
      }
    } else {
      result = response;
    }

    // last opportunity to modify response object

    result = _.merge({}, model, result, { cluster, section, datetime });
    if (done.indexOf(result.id.toString()) === -1) return [result];
    return [];
  }

  // Run

  run({
    config: { origin, list, size },
    data: { input, model },
    handlers: { handleGet, handleResponse },
  });
})
.catch(err => console.log(err));
