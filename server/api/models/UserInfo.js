/**
 * UserInfo.js
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

	target:{
		type:'string',
		enum: ['weight', 'cut', 'slim', 'power'],
		required: true,
		defaultsTo: 'weight'
	},

	bodyType:{
		type:'integer',
		enum: [1,2,3],
		defaultsTo:1,
		required:true
	},

	//========Personal customs==========//
	wakeUpHour:{
		type:'integer',
		required: true,
		defaultsTo: 730, //For 7:30
	},

	goToBedHour:{
		type:'integer',
		required: true,
		defaultsTo: 2300
	},

	mealsNumber:{
		type:'integer',
		required: true,
		defaultsTo: 5
	},

	eatingTimes:{
		type:'string',
		required: true,
		defaultsTo: '8:00, 12:00, 14:30, 17:00, 20:00'
	},

	canYouChangeDailyPlan:{
		type:'string',
		enum: ['no', 'rather_no', 'rather_yes', 'yes']
	},

	canYouPrepareDishes:{
		type:'string',
		enum: ['rather_no', 'maybe', 'yes']
	},

	canYouEatSameDaily:{
		type:'string',
		enum: ['rather_no', 'maybe', 'yes']
	},

	allergy:{
		type:'string'
	},

	notEating:{
		type:'string'
	},

	preserveWeightProblems:{
		type:'boolean',
		required: true,
		defaultsTo:true
	},

	usedEatingPlans:{
		type:'string'
	},

	dailyCalories:{
		type:'integer',
		required: true,
		defaultsTo:0
	},

	kitchenEquipment:{
		type:'integer', //Using bit mask - 101001
		required: true,
		defaultsTo:0
	},

	workType:{
		type:'string'
	},

	hintsForTrainer:{
		type:'text'
	},

	//==========Training survey===========//
	weight:{
		type:'integer',
		required: true,
		defaultsTo:75
	},

	height:{
		type:'integer',
		required: true,
		defaultsTo: 180
	},

	activity:{
		type:'string',
		enum: ['little', 'normal', 'medium','many','very much'],
		required: true,
		defaultsTo:'little'
	},

	bodySize:{
		model:'BodySize',
		required:true
	},

	gymExperience:{
		type:'string',
		enum: ['never','sometimes','long_time','expert'],
		required: true,
		defaultsTo:'never'
	},

	trainingsStatus:{
		type:'string',
		enum:['once','twice','three-four','more_than_four'],
		required: true,
		defaultsTo:'once'
	},

	trainingDescription:{
		type:'text'
	},

	otherTrainings:{
		type:'text'
	},

	currentStatus:{
		type:'string',
		enum:['bad','worse','not_so_bad','better','good'],
		required: true,
		defaultsTo:'bad'
	},

	possibleTrainings:{
		type:'integer',
		enum:[1,2,3,4,5,6],
		required: true,
		defaultsTo:1
	},

	mostImportantBodyPart:{
		type:'string',
		enum:['chest','legs','back','shoulders'
		,'biceps','triceps','belly','all'],
		required: true,
		defaultsTo:'belly'
	},

	availableEquipment:{
		type:'string',
		enum:['gym','home','none'],
		required: true,
		defaultsTo:'gym'
	},

	currentNutrition:{
		type:'text'
	},

	supplementsCost:{
		type:'integer',//200.00 PLN is 20000
		required: true,
		defaultsTo:0
	},

	contusionCheckboxes:{
		type:'integer', //Bit mask
		required: true,
		defaultsTo:0
	},

	contusionAdditional:{
		type:'string'
	},

	otherHints:{
		type:'text'
	},

	bodyPicture:{
		type:'url'
	},

	medicalReportName:{
		type:'string'
	},

	medicalReporKey:{
		type:'string'
	}
  }
};
