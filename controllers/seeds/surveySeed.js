'use strict';
require('dotenv').config()
const mongoose = require('mongoose')
const Survey = require('./../../models/survey');

mongoose.set('useCreateIndex', true);
const uri = process.env.MONGODB_URI;



/*
let question = "What do you call the meal you eat in the evening, normally somewhere between 5 and 10 PM?";
let options = ["dinner",
"either dinner or supper; I don't distinguish the two",
"supper",
"supper informally, and dinner in formal situations",
"supper is an evening meal while dinner is eaten earlier",
"dinner is a big meal; supper is a lighter meal",
"tea"];
let language = "English";
let createdBy = "000000";
// const responses = require('./dinnerVsupper');
let responses = [[59.91,10.75,0],
[42.5678,-70.8582,0],
[42.5678,-70.8582,2],
[42.5678,-70.8582,3],
[36.3122,-82.3836,3],
[45.0198,-93.2408,3],
[45.0198,-93.2408,4],
[40.8456,-74.5744,3],
[42.0213,-71.2181,5],
[42.0213,-71.2181,3],
[52.7665,-1.22428,0],
[52.7665,-1.22428,6],
[52.7665,-1.22428,5],
[52.7665,-1.22428,4],
[41.4704,-87.6307,2],
[40.6402,-74.0177,0],
[40.6402,-74.0177,1],
[48.1813,-101.285,5],
[48.1813,-101.285,3],
[32.5176,-87.8364,2],
[41.9718,-71.3468,2],
[38.923,-111.249,0],
[38.7479,-90.2114,1],
[41.1596,-95.9093,1],
[43.3332,-76.4092,0],
[41.0317,-73.5882,0],
[40.3624,-73.9881,0],
[41.3858,-72.2482,1]];

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
*/