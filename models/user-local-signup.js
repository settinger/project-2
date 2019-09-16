'use strict';

const bcrypt = require('bcryptjs');

const signUp = function(name, email, password, language, location) {
  const Model = this;

  return Model.findOne({ email })
    .then(user => {
      if (user) {
        throw new Error('USER_ALREADY_EXISTS');
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then(hash => {
      return Model.create({
        name: name,
        email: email,
        passwordHash: hash,
        language: language,
        location: location
      });
    })
    .then(user => {
      return Promise.resolve(user);
    })
    .catch(error => {
      console.log(`Error signing up: ${error}`);
      return Promise.reject(error);
    });
};

module.exports = signUp;