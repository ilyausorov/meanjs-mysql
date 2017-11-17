'use strict';

/**
 * ResetPass Model
 */

module.exports = function(sequelize, DataTypes) {
  var ResetPass = sequelize.define('ResetPass', {
    token: DataTypes.STRING
  }, {
    associate: function(models){
      ResetPass.belongsTo(models.User);
    }
  }
);
		
  return ResetPass;  
  
};
