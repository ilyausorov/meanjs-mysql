'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  path = require('path'),
  db = require(path.resolve('./settings/common_files/sequelize'));

module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'usernameOrEmail',
    passwordField: 'password'
  },
  function (usernameOrEmail, password, done) {
	db.User.find({
      where: { 
        $or: [
            { username: { $eq: usernameOrEmail.toLowerCase() } }, 
            { email: { $eq: usernameOrEmail.toLowerCase() } }
          ]
            }
    }).then(function (user) {
      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Invalid username or password'
        });
      }
      return done(null, user);
    }).catch(function (err) {
      return done(err);
    });
	  
  }));
};
