'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  db = require(path.resolve('./settings/common_files/sequelize')),
  errorHandler = require(path.resolve('./app/controllers/core/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;
 
  user.updateAttributes({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    displayName: req.body.firstName + ' ' + req.body.lastName,
    roles: req.body.roles,
    email: req.body.email,
    username: req.body.username
  }).then(function(user){
    return res.json(user);
  }).catch(function(err){
    return res.render('error', {
      error: err,
      status: 500
    });
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.destroy().then(function(){
    return res.json(user);
  }).catch(function(err){
    return res.render('error', {
      error: err,
      status: 500
    });
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  db.User.findAll().then(function(users){
    return res.json(users);
  }).catch(function(err){
    return res.render('error', {
      error: err,
      status: 500
    });
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  db.User.find({ where : { id: id } }).then(function(user){
    if (!user) {
      return next(new Error('Failed to load User ' + id));
    }
    req.model = user;
    next();
  }).catch(function(err){
    return next(err);
  });
};
