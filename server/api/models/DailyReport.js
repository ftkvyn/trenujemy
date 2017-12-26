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
	date:{
		type:'datetime',
		required: true
	},
	weight:{
		type:'integer',
		required: true,
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
	userNotes:{
		type:'text'
	},
	trainerNotes:{
		type:'text'
	},
	image:{
		type:'url'
	}
  }
};

