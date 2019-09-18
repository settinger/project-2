'use strict';

const ensureLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
};

const ensureLoggedOut = (req, res, next) => {
  req.session = req.session || {};
  if (req.session.user) {
    res.redirect('/user');
  } else {
    next();
  }
};

const eligibleForSurvey = (req, res, next) => {
  // TODO: ensure user only takes surveys in the language of interest, and user does not double-take surveys
  next();
}

module.exports = { ensureLoggedIn, ensureLoggedOut, eligibleForSurvey };