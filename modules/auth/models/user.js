'use strict';

const Joi = require('joi');

module.exports = {
  schema: {
    id: Joi.any().forbidden(),
    username: Joi.string().optional().max(100),
    email: Joi.string().email().required().max(254),
    password: Joi.string().required().min(6).max(100),
    scope: Joi.any().forbidden(),
  },
};
