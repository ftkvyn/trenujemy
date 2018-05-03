/**
 * FeedPlanPurchase.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const moment = require('moment');

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
	plan:{
		model: 'FeedPlan',
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
  },

  customToJSON: function() {
	  var obj = {...this};
      if(obj.plan && obj.plan.id){
      	if(obj.plan.isFreeSample){
      		obj.validTo = moment(obj.createdAt).add(1, 'days').toDate();
      	}else{
      		obj.validTo = moment(obj.createdAt).add(obj.plan.weeks, 'weeks').toDate();      		
      	}
      	obj.validToStr = moment(obj.validTo).format('YYYY-MM-DD');
      	obj.validFromStr = moment(obj.createdAt).format('YYYY-MM-DD');
      	
      }
      return obj;
	}
};

