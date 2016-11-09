'use strict';

const database = require('mssql');
const _ = require('lodash');
const Yelp = require('yelp');

const run = require('../runner.js');
const model = require('./model_venues.js');

// Set up config objects

const origin = 'yelp';
const list = 'venues';
const size = 5;
const apiConfig = {
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET,
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
.then(() => database.query`
  SELECT [location.lat] AS [lat], [location.lng] AS [lng]
  FROM [ibc_seg].[DM_SOURCE_FOURSQUARE_VENUES_RAW]
  WHERE [location.lat] IS NOT NULL AND [location.lng] IS NOT NULL
  GROUP BY [location.lat], [location.lng]`
)
.then((values) => {
  const input = values
    .map(item => `${item.lat},${item.lng}`)
    .map((item) => Object.assign({ latlon: item }, {
      offset: 0,
      name: item,
      cluster: item,
      section: 'restaurants,nightlife',
    }));

  // Set up handlers

  function handleGet({ offset, latlon, section }) {
    const yelp = new Yelp(apiConfig);
    return yelp.search({
      offset,
      limit: 20,
      ll: latlon,
      category_filter: section,
      radius_filter: 150,
      sort: 1,
    })
    .catch((error) => {
      if (error.statusCode === 400) return error;
      return { error, source: 'handleGet' };
    });
  }

  function handleResponse(item, response, done) {
    const { cluster, section } = item;
    const datetime = new Date().toISOString();

    if (!response.statusCode) {
      const pages = [];
      let numPages = 1;

      if (response.total > 20 && item.offset === 0) {
        numPages = Math.ceil(response.total / 20);

        for (let i = 1; i < numPages; i++) {
          const temp = Object.assign({}, item);
          temp.offset = i * 20;
          pages.push(temp);
        }
      }

      const rows = response.businesses.filter(row => done.indexOf(row.id.toString()) === -1);

      if (rows.length) {
        const result = rows
          .map((row) => {
            // last opportunity to modify response objects
            const newRow = row;
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

    if (response.statusCode === 400) {
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
})
.catch(err => console.log(err));
