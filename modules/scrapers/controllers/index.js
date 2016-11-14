'use strict';

const Boom = require('boom');

module.exports = function handler(request, reply) {
  const pTwitter = [];
  pTwitter.push(request.server.app.dbremote.query`
    SELECT  'venues' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_TWITTER_VENUES_RAW`);

  const pFacebook = [];
  pFacebook.push(request.server.app.dbremote.query`
    SELECT  'venues' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_FACEBOOK_VENUES_RAW`);

  const pFoursquare = [];
  pFoursquare.push(request.server.app.dbremote.query`
    SELECT  'venues' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_FOURSQUARE_VENUES_RAW`);

  const pYelp = [];
  pYelp.push(request.server.app.dbremote.query`
    SELECT  'venues' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_YELP_VENUES_RAW`);

  const pTripadvisor = [];
  pTripadvisor.push(request.server.app.dbremote.query`
    SELECT  'pages' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_TRIPADVISOR_PAGES_RAW`);
  pTripadvisor.push(request.server.app.dbremote.query`
    SELECT  'list' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_TRIPADVISOR_LIST_RAW`);
  pTripadvisor.push(request.server.app.dbremote.query`
    SELECT  'venues' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_TRIPADVISOR_VENUES_RAW`);

  const pMichelin = [];
  pMichelin.push(request.server.app.dbremote.query`
    SELECT  'list' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_MICHELIN_LIST_RAW`);
  pMichelin.push(request.server.app.dbremote.query`
    SELECT  'venues' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_MICHELIN_VENUES_RAW`);

  const pRepsol = [];
  pRepsol.push(request.server.app.dbremote.query`
    SELECT  'pages' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_REPSOL_PAGES_RAW`);
  pRepsol.push(request.server.app.dbremote.query`
    SELECT  'list' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_REPSOL_LIST_RAW`);
  pRepsol.push(request.server.app.dbremote.query`
    SELECT  'venues' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_REPSOL_VENUES_RAW`);

  const pMinube = [];
  pMinube.push(request.server.app.dbremote.query`
    SELECT  'pages' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_MINUBE_PAGES_RAW`);
  pMinube.push(request.server.app.dbremote.query`
    SELECT  'list' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_MINUBE_LIST_RAW`);
  pMinube.push(request.server.app.dbremote.query`
    SELECT  'venues' as [name],
            COUNT(DISTINCT [id]) AS [num_ids],
            MAX(CAST([datetime] AS [datetime])) AS [last_update]
    FROM ibc_seg.DM_SOURCE_MINUBE_POIS_RAW`);

  const sources = [
    pTwitter,
    pFacebook,
    pFoursquare,
    pYelp,
    pTripadvisor,
    pMichelin,
    pRepsol,
    pMinube,
  ].map(source => Promise.all(source)
    .then(values => values.map(row => row[0]))
    .catch(err => reply(Boom.badImplementation(err)))
  );

  Promise.all(sources)
  .then(([
    twitter,
    facebook,
    foursquare,
    yelp,
    tripadvisor,
    michelin,
    repsol,
    minube,
  ]) => reply.view('index', {
    twitter,
    facebook,
    foursquare,
    yelp,
    tripadvisor,
    michelin,
    repsol,
    minube,
  }))
  .catch(err => reply(Boom.badImplementation(err)));
};
