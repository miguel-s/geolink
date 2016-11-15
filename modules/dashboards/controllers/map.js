'use strict';

module.exports = function handler(request, reply) {
  reply.view('map', {
    user: request.auth.credentials,
  });
};
