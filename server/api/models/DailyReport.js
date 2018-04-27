/**
 * DailyReport.js
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
	//string formatted as YYYY-MM-DD. used because can't load day by exact match by day
	dateStr:{
		type: 'string',
		required: true
	},
	date:{
		type: 'ref', columnType: 'datetime',
		required: true
	},
	weight:{
		type:'number',columnType:'integer',
		defaultsTo: 0
	},
	bodySize:{
		model:'BodySize',
		required:true
	},
	trainings:{
		collection:'DailyTraining',
		via:'dailyReport'
	},
	dishes:{
		collection:'Dish',
		via:'dailyReport'
	},
	isSimpleDishMode:{
      type:'boolean'
    },
	userNotes:{
		type:'string',columnType:'text'
	},
	trainerNotes:{
		type:'string',columnType:'text'
	},
	image:{
		type:'string'
	}
  }
};

