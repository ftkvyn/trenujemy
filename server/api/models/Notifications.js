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

    freeSample:{
      type:'boolean'
    },

  	helloMessage:{
  		type:'boolean'
  	},

  	updateSurvey:{
  		type:'boolean'
  	},

    diaryDays:{
      type: 'json' //, columnType: 'array' 
    },

    //works only for user
    advices:{
      type:'json' // List of ids of trainers that have edited advices.
    },

    //works only for trainer
    // clients:{
    //   type:'json' 
    //   // dictionary, key - userId, value - things that changed
    //   // example:
    //   // {
    //   //   '11': {
    //   //     'acccount': true,
    //   //     'survey': false,
    //   //     'trainings': [121, 171, 191], // - ids of trainings
    //   //     'diary': [...] //array of days, ad diaryDays
    //   //   }
    //   }
    // }
  }
};

