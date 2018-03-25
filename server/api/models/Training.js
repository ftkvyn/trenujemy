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
  		type:'datetime'
  	},
  	userComment:{
  		type:'text'
  	},
  	trainerComment:{
  		type:'text'
  	},

    userGoogleEventId:{
      type:'string'
    },

    toJSON: function() {
        var obj = this.toObject();
        delete obj.userGoogleEventId;
        delete obj.trainerGoogleEventId;
        return obj;
    }
  }
};

