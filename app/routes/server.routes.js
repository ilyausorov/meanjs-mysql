'use strict';

/**
 * Module dependencies
 */

var passport = require('passport');

var users = require('../controllers/users/users.server.controller');
var articles = require('../controllers/articles/articles.server.controller');
var admin = require('../controllers/admin/admin.server.controller');
var adminPolicy = require('../controllers/admin/admin.server.policy');
var articlesPolicy = require('../controllers/articles/articles.server.policy');
var core = require('../controllers/core/core.server.controller');

module.exports = function (app) {

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);	
	
  // Users collection routes
  app.route('/api/users').get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/:userId').get(adminPolicy.isAllowed, admin.read)
  app.route('/api/users/:userId').put(adminPolicy.isAllowed, admin.update)
  app.route('/api/users/:userId').delete(adminPolicy.isAllowed, admin.delete);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
	
 // Articles collection routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
  app.route('/api/articles').get(articles.list)
  app.route('/api/articles').post(articles.create);

  // Single article routes
  app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
  app.route('/api/articles/:articleId').get(articles.read)
  app.route('/api/articles/:articleId').put(articles.update)
  app.route('/api/articles/:articleId').delete(articles.delete);

  // Finish by binding the article middleware
  app.param('articleId', articles.articleByID);

  // Setting up the users password api
  app.route('/api/auth/forgot').post(users.forgot);
  app.route('/api/auth/reset/:token').get(users.validateResetToken);
  app.route('/api/auth/reset/:token').post(users.reset);

  // Setting up the users authentication api
  app.route('/api/auth/signup').post(users.signup);
  app.route('/api/auth/signin').post(users.signin);
  app.route('/api/auth/signout').get(users.signout);

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);	
	
};
