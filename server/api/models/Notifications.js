/**
 * Notifications.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	user:{
  		model: 'User',
  		required:true,
  		unique: true
  	},

  	newPurchase:{
  		type:'boolean'
  	},

  	trainingInfo:{
  		type:'boolean'
  	},

  	feedInfo:{
  		type:'boolean'
  	},

  	consultInfo:{
  		type:'boolean'
  	},

  	helloMessage:{
  		type:'boolean'
  	},

  	updateSurvey:{
  		type:'boolean'
  	},

    diaryDays:{
      type:'array'
    }
  }
};

