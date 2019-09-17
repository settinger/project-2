'use strict';
require('dotenv').config()
const mongoose = require('mongoose')
const Survey = require('../../models/survey');

mongoose.set('useCreateIndex', true);
const uri = process.env.MONGODB_URI;


let question = "What do you call the kind of rain that falls while the sun is shining?";
let options = ["I have no special word or phrase for this",
"sunshower",
"the devil is beating his wife, the devil is whipping his wife",
"liquid sun(shine)"];
let language = "English";
let createdBy = "000000";
const responses = require('./sunshowers');

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
