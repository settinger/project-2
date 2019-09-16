'use strict';

const { Router } = require('express');
const router = Router();
const User = require('./../models/user')

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Hello World!' });
});

router.get('/login', (req, res, next) => {
  res.render('/views/login.hbs')
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.logIn(username, password) 
    .then(user => {
      req.session.user = {role: user.role, _id: user._id, username: user.username};
      res.redirect('/views/user.hbs')
    })
    .catch(error => {
      res.status(550).send('CREDENTIALS WONG', error);
    });
});

module.exports = router;
