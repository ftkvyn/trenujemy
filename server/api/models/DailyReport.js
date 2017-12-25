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
	bodySize:{
		model:'BodySize',
		required:true
	},
	trainings:{
		collection:'DailyTraining'
	},
	userNotes:{
		type:'text'
	},
	trainerNotes:{
		type:'text'
	}
  }
};

