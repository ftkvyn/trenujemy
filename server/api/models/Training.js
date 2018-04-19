/**
 * Training.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	user:{
  		model: 'User',
  		required:true	
  	},
    trainer:{
      model:'User',
      required: true
    },
  	purchase:{
  		model: 'TrainPlanPurchase',
  		required:true	
  	},
  	place:{
  		type:'string',
  		required:true
  	},
  	date:{
  		type: 'ref', columnType: 'datetime',
  	},
  	userComment:{
  		type:'string',columnType:'text'
  	},
  	trainerComment:{
  		type:'string',columnType:'text'
  	},

    userGoogleEventId:{
      type:'string'
    },    
  },
  customToJSON: function() {
      var obj = _.omit(this, ['userGoogleEventId', 'trainerGoogleEventId'])
      return obj;
  }
};

