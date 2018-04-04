/**
 * DailyTraining.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const modifiers = {
	'none':0,
	'gym': 0.12,
	'bicycle': 0.10, 
	'rollers': 0.10, 
	'jogging': 0.10,
	'swimming':0.10,
	'walk':0.05
};

module.exports = {
  attributes: {
  	dailyReport:{
		model:'DailyReport',
		required: true
	},
	type:{
		type:'string',
		isIn: ['none','gym', 'bicycle', 'rollers', 'jogging','swimming','walk'],
		defaultsTo: 'none'
	},
	length:{
		type:'number',columnType:'integer',
		defaultsTo:0
	},
	calories:{
		type:'number',columnType:'integer',
		defaultsTo:0
	},
	text:{
		type:'string',columnType:'text'
	}	
  },
  beforeValidate: function (values, cb) {
  	values.calories = 0;
  	values.length = values.length || 0;
  	if(!values.length){
  		cb();
  		return;
  	}
  	DailyReport.findOne({id: values.dailyReport})
  	.exec(function(err, report){
  		if(err){
  			console.error(err);
  			cb();
  		}
  		UserInfo.findOne({user: report.user})
  		.exec(function(err, info){
  			if(err){
	  			console.error(err);
	  			cb();
	  		}
  			const weight =  info.weight || 0;
  			const modifier = modifiers[values.type] || 0;
  			values.calories = Math.round(values.length * weight * modifier);
  			cb();
  		});
  	});
  }
};

