'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  path = require('path'),
  config = require(path.resolve('./settings/settings')),
  db = require(path.resolve('./settings/common_files/sequelize'));

/**
 * Module init function
 */
module.exports = function (app) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {	  
   db.User.find({ where: { id: id } }).then(function(user){
      if(!user){
        return done(null, false);
      }
	   
	  //correct user.roles by making it into an array 
	  if(user.roles){
		  var temp=[];
		  temp.push(user.roles);
		  delete user.roles;
		  user.roles = temp;
	  }

      done(null, user);
    }).catch(function(err){
      done(err, null);
    });
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, '../social_login/**/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};
