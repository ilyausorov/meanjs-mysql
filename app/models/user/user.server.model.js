'use strict';

/**
 * User Model
 */

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
	displayName: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    provider: DataTypes.STRING,
    salt: DataTypes.STRING,
    profileImageURL: {
      type: DataTypes.STRING,
      defaultValue: 'assets/images/profile/default.png'
    },
    roles: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    }
  }, {
    associate: function(models) {
       User.hasMany(models.Article),
       User.hasOne(models.ResetPass)
    }
  }
);
  
  User.prototype.toJSON = function () {
	var values = this.get();
	delete values.password;
	delete values.salt;
	return values;
  }
  
  User.prototype.makeSalt = function() {
	return crypto.randomBytes(16).toString('base64');
  }
	  
  User.prototype.authenticate = function(plainText){
	return this.encryptPassword(plainText, this.salt) === this.password;
  }
	  
  User.prototype.encryptPassword = function(password, salt) {
    if (!password || !salt) {
      return '';
    }
    salt = new Buffer(salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('base64');
  }
	
  return User;
}