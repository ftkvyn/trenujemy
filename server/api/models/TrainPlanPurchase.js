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
    trainer:{
      model:'User',
      required: true
    },
  	plan:{
  		model: 'TrainPlan',
  		required:true	
  	},
  	trainsCount:{
          type:'number',columnType:'integer',
    },
    trainsLeft:{
    	type:'number',columnType:'integer',
    },
  	isActive:{
  		type:'boolean',
  		required:true
  	},
  	transaction:{
  		model:'Transaction',
  		required:true
  	},
  },

  beforeUpdate: function (values, cb) {
  	if(values.trainsLeft === 0){
  		values.isActive = false;
  	}
    cb();
  },

  customToJSON: function() {
      var obj = {...this};
      obj.validTo = moment(obj.createdAt).add(12, 'months').toDate();
      obj.validToStr = moment(obj.validTo).format('YYYY-MM-DD');
      obj.validFromStr = moment(obj.createdAt).format('YYYY-MM-DD');
      return obj;
  }
};

