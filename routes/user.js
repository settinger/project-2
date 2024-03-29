'use strict';

const { Router } = require('express');
const router = Router();
const User = require('./../models/user')
const Survey = require('./../models/survey');
const allLanguages = require('./../controllers/allLanguages');
const filters = ["All languages", ...allLanguages];
const middleware = require('./../controllers/middleware');
require('dotenv').config();


// USER PAGE, DISPLAYING AVAILABLE SURVEYS TO TAKE, AND A LIST OF ALL SURVEYS TO VIEW

// USER START PAGE LOADING ALL RELEVANT DATA
router.get('/', middleware.ensureLoggedIn, (req, res, next) => {
  // Get user from database
  User.findById(req.session.user._id)
    .then(user => {
      const name = user.name;
      const language = user.language;
      // Find surveys user has taken
      const surveysTaken = user.surveysTaken;
      // Get all surveys, filter the ones in user's language
      Survey.find({approved: true}, 'question language')
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
  
});

// LOGIN FUNCTIONALITY BAR IN NAV 
router.get('/login', middleware.ensureLoggedOut, (req, res, next) => {
  res.render('login', {title: "Log In"});
});

// INITIATE SESSION AFTER LOGIN DETAILS RETRIEVED SUCCESSFULLY
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

// CLEAR SESSION AFTER LOG OUT
router.post('/logout', middleware.ensureLoggedIn, (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});


// REGISTRATION PAGE, COLLECTS USER MAIL, PASSWORD, NAME, LANGUAGE AND LOCATION
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



// ADJUST PREFERENCES PAGE: USER CAN CHANGE SURVEY LANGUAGE, NAME, AND LOCATION
router.get('/update', middleware.ensureLoggedIn, (req, res, next) => {
  const data = {
    languages: allLanguages,
    googMapsApiKey: process.env.GOOGMAPS_API_KEY
  };
  // GET USERS CURRENT NAME, LANGUAGE AND LOCATION
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

// ENSURE THE CHANGES ARE RETRIEVED...
router.post('/update', middleware.ensureLoggedIn, (req, res, next) => {
  const data = {
    languages: allLanguages,
    googMapsApiKey: process.env.GOOGMAPS_API_KEY
  };
  const userId = req.session.user._id;
  const name = req.body.humanName;
  const language = req.body.language;
  const location = [req.body.latitude, req.body.longitude];

//... AND ACTUALLY ADJUST THEM IN DATABASE
  User.findByIdAndUpdate(userId, {name, language, location})
    .then(user => {
      data.message = "Preferences updated.";
      data.currName = name;
      data.currLang = language;
      data.currLat = req.body.latitude;
      data.currLng = req.body.longitude;
      res.render('update', data);
    })
    .catch(() => {
      data.message = "Error updating preferences.";
      res.render('update', data);
    });
});

// ==== ADMINISTRATION PAGE WHERE ADMINS CAN APPROVE OR REJECT NEW SURVEYS MADE BY USERS
router.get('/admin', middleware.ensureLoggedIn, (req, res, next) => {
  User.findById(req.session.user._id)
    .then(user => {
      if (!user.admin) {
        res.redirect('/');
      } else {
        // Get list of all unapproved surveys
        // Render each survey with an approve or delete button
        // Click to approve or delete them
        Survey.find({$or: [{approved: {$exists: false}}, {approved: false}]}, 'question options language')
          .then(newSurveys => {
            res.render('admin', {newSurveys});
          })
      }
    })
    .catch(() => {
      res.redirect('/');
    });
});
router.post('/admin/approve/:id', middleware.ensureLoggedIn, (req, res, next) => {
  const surveyId = req.params.id;
  User.findById(req.session.user._id)
    .then(user => {
      if(!user.admin) {
        res.redirect('/');
      } else {
        Survey.findByIdAndUpdate(surveyId, {approved: true})
          .then(() => {
            res.redirect('/user/admin')
          });
      }
    })
    .catch(() => {
      res.redirect('/');
    });
})
router.post('/admin/reject/:id', middleware.ensureLoggedIn, (req, res, next) => {
  const surveyId = req.params.id;
  User.findById(req.session.user._id)
    .then(user => {
      if(!user.admin) {
        res.redirect('/');
      } else {
        Survey.findByIdAndDelete(surveyId)
          .then(() => {
            res.redirect('/user/admin')
          });
      }
    })
    .catch(() => {
      res.redirect('/');
    });
})

// ENABLE USERS TO DELETE THEIR ACCOUNT AND PERSONAL DATA
router.post('/delete', middleware.ensureLoggedIn, (req, res, next) => {
  const userId = req.session.user._id;
  User.findByIdAndDelete(userId)
    .then(() => {
      req.session.destroy();
      res.redirect('/');
    })
    .catch(() => {
      res.render('update', {errorMessage: "There was a problem deleting the user."})
    });
});

module.exports = router;
