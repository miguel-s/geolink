'use strict';

const database = require('mssql');
const _ = require('lodash');
const xray = require('x-ray');

const run = require('../runner.js');
const model = require('./model_venues.js');

// Set up config

const origin = 'tripadvisor';
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
  SELECT [id], [url], [name], [city], [cuisine], [price]
  FROM (
    SELECT  *,
            ROW_NUMBER() OVER (PARTITION BY [id] ORDER BY [id], [datetime] DESC) AS [rank_time]
    FROM [ibc_seg].[DM_SOURCE_TRIPADVISOR_LIST_RAW] ) AS A
  WHERE [rank_time] = 1`)
.then((rows) => {
  const input = rows
    .map((item) => Object.assign({}, item, {
      name: `${item.city} - ${item.name}`,
      cluster: item.id,
      section: null,
    }));

  // Set up handlers

  function handleGet({ url }) {
    const x = xray();

    return new Promise((resolve, reject) => {
      x(url, 'body',
        {
          name: '#HEADING',
          address: {
            street: '.street-address',
            postalCode: '.locality span[property=postalCode]',
            city: '.locality span[property=addressLocality]',
            country: '.country-name',
          },
          telephone: '.phoneNumber',
          ranking: ['.slim_ranking'],
          rating: '.heading_ratings img@content',
          ratingVisitors: {
            excellent: '.visitorRating .barChart li:nth-child(1) .valueCount.fr.part',
            veryGood: '.visitorRating .barChart li:nth-child(2) .valueCount.fr.part',
            average: '.visitorRating .barChart li:nth-child(3) .valueCount.fr.part',
            poor: '.visitorRating .barChart li:nth-child(4) .valueCount.fr.part',
          },
          ratingSummary: {
            food: '.ratingSummary .barChart li:nth-child(1) .ratingRow:nth-child(1) img@alt',
            service: '.ratingSummary .barChart li:nth-child(1) .ratingRow:nth-child(2) img@alt',
            value: '.ratingSummary .barChart li:nth-child(2) .ratingRow:nth-child(1) img@alt',
            atmosphere: '.ratingSummary .barChart li:nth-child(2) .ratingRow:nth-child(2) img@alt',
          },
          numReviews: '#TABS_REVIEWS .tabs_pers_counts',
          numQAs: '.qaQuestionCount',
          opening: x('#BODYCON div + .detail',
                      [{
                        day: '.day',
                        hours: ['.hoursRange'],
                      }]),
        }
      )((err, arr) => {
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
    result.cuisine = item.cuisine;
    result.price = item.price;

    result.numReviews = response.numReviews ? response.numReviews.replace('(', '').replace(')', '').replace('.', '').trim() : null;
    result.QAs = response.QAs ? response.QAs.replace('(', '').replace('(', '').trim() : null;
    result.ranking = response.ranking ? response.ranking.join().replace(/\n/g, '').trim() : null;
    result.opening = {
      monday: response.opening.find(i => i.day === 'lunes') ?
        response.opening.find(i => i.day === 'lunes').hours.join(', ') : null,
      tuesday: response.opening.find(i => i.day === 'martes') ?
        response.opening.find(i => i.day === 'martes').hours.join(', ') : null,
      wednesday: response.opening.find(i => i.day === 'miércoles') ?
        response.opening.find(i => i.day === 'miércoles').hours.join(', ') : null,
      thursday: response.opening.find(i => i.day === 'jueves') ?
        response.opening.find(i => i.day === 'jueves').hours.join(', ') : null,
      friday: response.opening.find(i => i.day === 'viernes') ?
        response.opening.find(i => i.day === 'viernes').hours.join(', ') : null,
      saturday: response.opening.find(i => i.day === 'sábado') ?
        response.opening.find(i => i.day === 'sábado').hours.join(', ') : null,
      sunday: response.opening.find(i => i.day === 'domingo') ?
        response.opening.find(i => i.day === 'domingo').hours.join(', ') : null,
    };

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
