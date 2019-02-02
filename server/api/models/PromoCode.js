/**
 * PromoCode.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	user:{
		model: 'User',
	},

	trainer:{
        model:'User',
        required: true
    },	

	value:{
		type:'string',
		required: true
	},

	transaction:{
		model:'Transaction'
	},

	trainPlan:{
		model:'TrainPlan'
	},

	feedPlan:{
		model:'FeedPlan'
	}

  }
};

