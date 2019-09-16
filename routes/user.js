'use strict';

const { Router } = require('express');
const router = Router();
const User = require('./../models/user')
const allLanguages = require('./../controllers/allLanguages');


router.get('/', (req, res, next) => {
  res.render('user', { name: 'James Dean' });
});


router.get('/login', (req, res, next) => {
  res.render('login')
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.logIn(username, password) 
    .then(user => {
      req.session.user = {_id: user._id, username: user.username};
      res.redirect('/user');
    })
    .catch(error => {
      res.status(401).send('CREDENTIALS WRONG', error);
    });
});

router.post('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/register', (req, res, next) => {
  res.render('register', {languages: allLanguages});
});

router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const language = req.body.language;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  User.register(username, email, password, language, latitude, longitude) 
    .then(user => {
      req.session.user = {_id: user._id, username: user.username};
      res.redirect('/user');
    })
    .catch(error => {
      res.status(401).send('CREDENTIALS WRONG', error);
    });
});

module.exports = router;
