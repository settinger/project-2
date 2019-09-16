'use strict';

const { Router } = require('express');
const router = Router();
const User = require('./../models/user')

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
      res.render('user');
    })
    .catch(error => {
      res.status(550).send('CREDENTIALS WONG', error);
    });
});

module.exports = router;
