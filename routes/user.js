'use strict';

const { Router } = require('express');
const router = Router();
const User = require('./../models/user')
const Survey = require('./../models/survey');
const allLanguages = require('./../controllers/allLanguages');
const filters = ["All languages", ...allLanguages];
const middleware = require('./../controllers/middleware');
require('dotenv').config();

/*
Base user page: this should show a list of surveys available
  for taking, and a list of maps available for viewing
*/
router.get('/', middleware.ensureLoggedIn, (req, res, next) => {
  // Get user from database
  User.findById(req.session.user._id)
    .then(user => {
      const name = user.name;
      const language = user.language;
      // Find surveys user has taken
      const surveysTaken = user.surveysTaken;
      // Get all surveys, filter the ones in user's language
      Survey.find({}, 'question language')
        .then(allSurveys => {
          const availableSurveys = allSurveys.filter(s => {
            return (s.language === user.language && !surveysTaken.includes(s._id));
          });
          const allSurveysJSON = JSON.stringify(allSurveys);
          res.render('user', {availableSurveys, allSurveys, name, language, filters, allSurveysJSON});
        });
    })
    .catch(err => {
      res.render('user', {errorMessage: "Error loading user."});
    });
  
  // res.render('user', { name: 'James Dean' });
});

/* Login page */
router.get('/login', middleware.ensureLoggedOut, (req, res, next) => {
  res.render('login', {title: "Log In"});
});

router.post('/login', middleware.ensureLoggedOut, (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.logIn(email, password) 
    .then(user => {
      req.session.user = {_id: user._id, email: user.email};
      res.redirect('/user');
    })
    .catch(() => {
      res.status(401).render('index', {loginError: 'Incorrect email or password, please try again'})
    });
});

/* Logout POST request */
router.post('/logout', middleware.ensureLoggedIn, (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

/*
Registration page: this collects user's email, password,
  preferred name, preferred language, and location
*/
router.get('/register',  middleware.ensureLoggedOut, (req, res, next) => {
  res.render('register', {languages: allLanguages, googMapsApiKey: process.env.GOOGMAPS_API_KEY});
});

router.post('/register', middleware.ensureLoggedOut, (req, res, next) => {
  const username = req.body.humanName;
  const email = req.body.email;
  const password = req.body.password;
  const language = req.body.language;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  User.register(username, email, password, language, latitude, longitude) 
    .then(user => {
      req.session.user = {_id: user._id, email: user.email};
      res.redirect('/user');
    })
    .catch(error => {
      res.status(401).send('CREDENTIALS WRONG', error);
    });
});


/*
Update-preferences page: This lets the user update their survey
  language, preferred name, and location
*/
router.get('/update', middleware.ensureLoggedIn, (req, res, next) => {
  const data = {
    languages: allLanguages,
    googMapsApiKey: process.env.GOOGMAPS_API_KEY
  };
  // Get user's current preferred name, language, and location
  const userId = req.session.user._id;
  User.findById(userId)
    .then(user => {
      data.currName = user.name;
      data.currLang = user.language;
      data.currLat = user.location[0];
      data.currLng = user.location[1];
      res.render('update', data);
    })
    .catch(err => {
      data.errorMessage = err;
      res.render('update', data);
    });
});

router.post('/update', middleware.ensureLoggedIn, (req, res, next) => {
  // console.log(req.body);
  const data = {
    languages: allLanguages,
    googMapsApiKey: process.env.GOOGMAPS_API_KEY
  };
  const userId = req.session.user._id;
  const name = req.body.humanName;
  const language = req.body.language;
  const location = [req.body.latitude, req.body.longitude];

  User.findByIdAndUpdate(userId, {name, language, location})
    .then(user => {
      data.message = "Preferences updated.";
      data.currName = name;
      data.currLang = language;
      data.currLat = req.body.latitude;
      data.currLng = req.body.longitude;
      res.render('update', data);
    })
    .catch(err => {
      data.message = "Error updating preferences.";
      res.render('update', data);
    });
  // res.redirect('/user/update');
});

router.get('/admin', middleware.ensureLoggedIn, (req, res, next) => {
  res.render('admin');
});

/* Delete user account */
router.post('/delete', middleware.ensureLoggedIn, (req, res, next) => {
  const userId = req.session.user._id;
  User.findByIdAndDelete(userId)
    .then(() => {
      req.session.destroy();
      res.redirect('/');
    })
    .catch(() => {
      res.render('update', {errorMessage: "There was a problem deleting the user."})
    })
})

module.exports = router;
