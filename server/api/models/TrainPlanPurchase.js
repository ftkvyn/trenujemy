/**
 * TrainPlanPurchase.js
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
	plan:{
		model: 'TrainPlan',
		required:true	
	},
	trainsCount:{
        type:'integer',
    },
    trainsLeft:{
    	type:'integer',
    },
	isActive:{
		type:'boolean',
		required:true
	},
	transaction:{
		model:'Transaction',
		required:true
	},

	toJSON: function() {
        var obj = this.toObject();
      	obj.validTo = moment(obj.updatedAt).add(12, 'months').toDate();
      	obj.validToStr = moment(obj.validTo).format('YYYY-MM-DD');
      	obj.validFromStr = moment(obj.updatedAt).format('YYYY-MM-DD');
        return obj;
    }
  },

  beforeUpdate: function (values, cb) {
  	if(!values.trainsLeft){
  		values.isActive = false;
  	}
    cb();
  }
};

