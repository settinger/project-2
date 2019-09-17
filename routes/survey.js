'use strict';

const { Router } = require('express');
const router = Router();
const Survey = require('./../models/survey');
const User = require('./../models/user');
const allLanguages = require('./../controllers/allLanguages');
const middleware = require('./../controllers/middleware');
const makeRadioSurvey = require('./../controllers/makeRadioSurvey');

router.get('/', (req, res, next) => {
  res.render('survey/surveyMain');
});


/* Make-survey page */
router.get('/makesurvey', middleware.ensureLoggedIn, (req, res, next) => {
  res.render('survey/makeSurvey', {languages: allLanguages});
});


/* GET/POST methods for URLs of the form /survey/:id */
router.get('/:id', middleware.ensureLoggedIn, (req, res, next) => {
  const surveyId = req.params.id;
  const userId = req.session.user._id;
  console.log(req.session.user._id);
  Survey.findById(surveyId)
    .then(survey => {
      // Ensure user has not taken survey
      // Nested promises, sorry not sorry
      User.findById(userId)
        .then(user => {
          if (user.surveysTaken.includes(surveyId)) {
            res.redirect(`/map/${surveyId}`);
          } else {
            // Don't pass the responses when rendering the survey page (because it might be a huge array)
            const data = {_id: survey._id, question: survey.question, options: survey.options, language: survey.language};

            // I can't figure out how to render the radio buttons survey in handlebars, so I'm doing it in Node and passing it as an argument
            data.radioSurvey = makeRadioSurvey(survey.options);

            res.render('survey/takeSurvey', data);
          }
        })
        .catch(err => {
          res.render('survey/takeSurvey', {errorMessage: `Survey not found.`});
        });
    })
    .catch(err => {
      res.render('survey/takeSurvey', {errorMessage: `Survey not found.`});
    });
});

router.post('/:id', middleware.ensureLoggedIn, (req, res, next) => {
  const surveyId = req.params.id;
  const surveyAnswer = parseInt(req.body.surveyresult);
  const userId = req.session.user;
  Survey.findById(surveyId)
    .then(survey => {
      // Ensure user has not taken survey
      // Nested promises, sorry not sorry
      User.findById(userId)
        .then(user => {
          if (user.surveysTaken.includes(surveyId)) {
            res.redirect(`/map/${surveyId}`);
          } else {
            // Update user in database to include the fact that this survey has been taken
            let surveysTaken = user.surveysTaken;
            surveysTaken.push(surveyId);
            User.findByIdAndUpdate(userId, {surveysTaken})
              .then(() => {
                // Update survey in database to include the new response
                let surveyResponses = survey.responses;
                surveyResponses.push([...user.location, surveyAnswer]);
                Survey.findByIdAndUpdate(surveyId, {responses: surveyResponses})
                  .then(() => {
                    console.log('Survey result saved!')
                    res.redirect(`/map/${surveyId}`);
                  });
              });
          }
        })
        .catch(err => {
          res.render('survey/takeSurvey', {errorMessage: `Survey not found.`});
        });
    })
    .catch(err => {
      res.render('survey/takeSurvey', {errorMessage: `Survey problem.`});
    });
});


module.exports = router;
