/**
 * DailyTraining.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const modifiers = {
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
		enum: ['gym', 'bicycle', 'rollers', 'jogging','swimming','walk'],
		required: true,
		defaultsTo: 'weight'
	},
	length:{
		type:'integer',
		required:true,
		defaultsTo:0
	},
	calories:{
		type:'integer',
		required:true,
		defaultsTo:0
	},
	text:{
		type:'text'
	}	
  },
  beforeSave: function (values, cb) {
  	values.calories = 0;
  	values.length = values.length || 0;
  	if(!values.length){
  		cb();
  		return;
  	}
  	DailyReport.findOne({id: values.dailyReport})
  	.exec(function(err, report){
  		if(err){cb();}
  		UserInfo.findOne({user: report.user})
  		.exec(function(err, info){
  			if(err){cb();}
  			const weight =  info.weight || 0;
  			const modifier = modifiers[values.type] || 0;
  			values.calories = values.length * weight * modifier;
  			cb();
  		});
  	});
  }
};

