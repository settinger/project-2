'use strict';

const { Router } = require('express');
const router = Router();
const User = require('./../models/user')
const allLanguages = require('./../controllers/allLanguages');
const middleware = require('./../controllers/middleware');
require('dotenv').config();

/*
Base user page: this should show a list of surveys available
  for taking, and a list of maps available for viewing
*/
router.get('/', (req, res, next) => {
  res.render('user', { name: 'James Dean' });
});

/* Login page */
router.get('/login', middleware.ensureLoggedOut, (req, res, next) => {
  res.render('login');
});

router.post('/login', middleware.ensureLoggedOut, (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.logIn(email, password) 
    .then(user => {
      req.session.user = {_id: user._id, email: user.email};
      res.redirect('/user');
    })
    .catch(error => {
      res.status(401).send('CREDENTIALS WRONG', error);
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

module.exports = router;
