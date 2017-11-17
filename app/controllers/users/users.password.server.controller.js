'use strict';

/**
 * Module dependencies
 */

var path = require('path'),
  config = require(path.resolve('./settings/settings')),
  errorHandler = require(path.resolve('./app/controllers/core/errors.server.controller')),
  db = require(path.resolve('./settings/common_files/sequelize')),
  nodemailer = require('nodemailer'),
  mandrillTransport = require('nodemailer-mandrill-transport'),
  async = require('async'),
  crypto = require('crypto');

var smtpTransport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: config.mailer.options.auth.key
  }
}));

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.usernameOrEmail) {
        var usernameOrEmail = String(req.body.usernameOrEmail).toLowerCase();

		db.User.find({
		  where: { $or: [{username: {$eq: usernameOrEmail.toLowerCase()}}, {email: {$eq: usernameOrEmail.toLowerCase()}}]}
		}).then(function (user) {
          if (!user) {
            return res.status(400).send({
                message: 'No account with that username has been found'
            });
          } else {            
            //Create Reset Token
            db.ResetPass.create({ token:token, UserId: user.id }).then(function(reset){
                if(!reset){
                  return res.status(400).send({
                      message: 'You cannot reset your password'
                  });
                } else {
                  done(undefined, token, user);
                }
            }).catch(function(err){
              done(err, token, user);
            });
          }
        });
		  
      } else {
        return res.status(422).send({
          message: 'Username/email field must not be blank'
        });
      }
    },
    function (token, user, done) {

      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = config.domain || httpTransport + req.headers.host;
      res.render(path.resolve('app/views/views_html/email_templates/reset-password-email'), {
        name: user.displayName,
        appName: config.app.title,
        url: baseUrl + '/api/auth/reset/' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
  
 db.ResetPass.find({ where : {
    token: req.params.token,
    createdAt: {
      $gt: Date.now() - 3600000 // 1 hour
    }
  } }).then(function (user) {
    if (!user) {
      return res.redirect('/password/reset/invalid');
    }
    res.redirect('/password/reset/' + req.params.token);
  });
	
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;

  async.waterfall([

    function (done) {

      db.ResetPass.find({where : { token: req.params.token, createdAt: { $gt: Date.now() - 3600000 }}}).then(function (reset) {
        if(reset){
          console.log("reset here")
          //Find User
          db.User.find({ where: { id: reset.UserId } }).then(
              function(user){
                if (user) {
                  console.log("user here")
                  if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                    //Update Password
                    user.updateAttributes({
                      password: user.encryptPassword(passwordDetails.newPassword, user.salt)
                    }).then(function(a){
                      //Login User
                      req.login(user, function (err) {
                        if (err) {
                          res.status(400).send(err);
                        } else {
                          // Remove sensitive data before return authenticated user
                          user.password = undefined;
                          user.salt = undefined;
                          res.json(user);
                          //Remove Reset Token
                          reset.destroy().then(function(){
                            done(err, user);
                          }).catch(function(err){
                            res.status(400).send(err);
                          });
                        }
                      });
                    }).catch(function(err){
                      return res.status(400).send({
                        message: 'Sorry, It was unsuccessful'
                      });
                    });
                  } else {
                    return res.status(400).send({
                      message: 'Passwords do not match'
                    });
                  }
                } else {
                  return res.status(400).send({
                    message: 'Password reset token is invalid or has expired.'
                  });
                }
              }
          );
        }else{
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      }).catch(function (err){
        return res.status(400).send({
          message: 'Password reset token is invalid or has expired.'
        });
      });
		
		
    },
    function (user, done) {
      res.render('app/views/views_html/email_templates/reset-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  if (req.user) {
    if (passwordDetails.newPassword) {
      db.User.find({ where : { id: req.user.id } }).then(function (user) {
        if (user) {			
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.updateAttributes({
                password : user.encryptPassword(passwordDetails.newPassword, user.salt)
              }).then(function(user){
				  req.login(user, function (err) {
					if (err) {
					  res.status(400).send(err);
					} else {
					  res.send({
						message: 'Password changed successfully'
					  });
					}
				  });
				}).catch(function (err) {
				  return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				  });
				});
            } else {
              res.status(400).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(400).send({
              message: 'Current password is incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
	//	
    } else {
      res.status(422).send({
        message: 'Please provide a new password'
      });
    }
	  //
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};
