'use strict';

module.exports = function handler(request, reply) {
  reply.view('index', {
    user: request.auth.credentials,
  });
};
