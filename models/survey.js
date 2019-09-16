'use strict';

const allLanguages = require('./../controllers/allLanguages');
const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  question: {
    type: String,
    trim: true,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: allLanguages,
    required: true
  },
  responses: {
    type: Array,
    default: []
  }
});

// Add schema statics if necessary
surveySchema.statics = surveySchema.statics || {};

module.exports = mongoose.model('Survey', surveySchema);
