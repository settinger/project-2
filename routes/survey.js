'use strict';

const { Router } = require('express');
const router = Router();
const Survey = require('./../models/survey');
const middleware = require('./../controllers/middleware');

router.get('/', (req, res, next) => {
  res.render('survey/surveyMain');
});

router.get('/:id', middleware.ensureLoggedIn, (req, res, next) => {
  const surveyId = req.params.id;
  Survey.findById(surveyId)
    .then(survey => {
      console.log(survey);
      res.render('survey/takeSurvey', survey);
    })
    .catch(err => {
      res.render('survey/surveyMain', {errorMessage: "Survey not found. ", err});
    });
});
module.exports = router;
