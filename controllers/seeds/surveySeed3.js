'use strict';
require('dotenv').config()
const mongoose = require('mongoose')
const Survey = require('../../models/survey');

mongoose.set('useCreateIndex', true);
const uri = process.env.MONGODB_URI;


let question = "What do you call the auxiliary brake that's attached to a rear wheel or the transmission and keeps the car from moving accidentally?";
let options = ["emergency brake",
"parking brake",
"e brake",
"hand brake"];
let language = "English";
let createdBy = "000000";
const responses = require('./parkingbrake');

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    Survey.create([{question, options, createdBy, language, responses}])
    .then(survey => {
      console.log("survey");
    } )
    .catch(err => {
      console.log("ERROR", err);
    })
  })
  .catch(err => {
    console.log('error connecting', err);
  });
