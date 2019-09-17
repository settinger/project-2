'use strict';

const { Router } = require('express');
const router = Router();
const Survey = require('./../models/survey');
const User = require('./../models/user');
const middleware = require('./../controllers/middleware');
require('dotenv').config();

router.get('/', (req, res, next) => {
  res.render('map/mapMain');
})

router.get('/:id', (req, res, next) => {
  const data = {
    googMapsApiKey: process.env.GOOGMAPS_API_KEY
  };
  // Get results from survey
  const surveyId = req.params.id;
  Survey.findById(surveyId)
    .then(survey => {
      data.question = survey.question;
      data.surveyResults = JSON.stringify(survey.responses);
      data.surveyOptions = JSON.stringify(survey.options);
      res.render('map/result', data);
    })
    .catch(err => {
      res.render('map/mapMain', {errorMessage: "Survey not found."})
    })
});

module.exports = router;
