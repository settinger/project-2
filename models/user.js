'use strict';

const allLanguages = require('./../controllers/allLanguages');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: allLanguages
  },
  location: {
    type: [Number]
  },
  surveysTaken: {
    type: [String],
    default: []
  }
});

// Add log-in and sign-up functions as schema statics
schema.statics = schema.statics || {};
schema.statics.logIn = require('./user-local-login');
schema.statics.register = require('./user-local-register');

module.exports = mongoose.model('User', schema);
