'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./app/controllers/core/errors.server.controller')),
  passport = require('passport'),
  db = require(path.resolve('./settings/common_files/sequelize'));
  

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security purposes we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  var user = db.User.build(req.body);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;
  user.salt = user.makeSalt();
  user.profileImageURL = 'assets/images/profile/default.png';
  user.password = user.encryptPassword(req.body.password, user.salt);
	
  // Then save the user
   user.save().then(function(){
    req.login(user, function(err){
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

	  //correct user.roles by making it into an array 
	  if(user.roles){
		  var temp=[];
		  temp.push(user.roles);
		  delete user.roles;
		  user.roles = temp;
	  } 	
		
      res.json(user);
    });
  }).catch(function(err){
    // Remove sensitive data in any case
    user.password = undefined;
    user.salt = undefined;

    res.render('/authentication/signup',{
      message: message,
      user: user
    });
  });
	
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(422).send(info);
    } else {
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
			
		if(user.roles){
		  var temp=[];
		  temp.push(user.roles);
		  delete user.roles;
		  user.roles = temp;
		} 	
			
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};
