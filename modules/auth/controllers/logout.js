'use strict';

module.exports = function handler(request, reply) {
  request.cookieAuth.clear();

  return reply.redirect('/');
};
