/**
 * TrainPlanPurchase.js
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
	plan:{
		model: 'TrainPlan',
		required:true	
	},
	isActive:{
		type:'boolean',
		required:true
	},
	transaction:{
		model:'Transaction',
		required:true
	}
  }
};
