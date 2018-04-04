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
		isIn: ['weight', 'cut', 'slim', 'power'],
		defaultsTo: 'weight'
	},

	bodyType:{
		type:'number',columnType:'integer',
		isIn: [1,2,3],
		defaultsTo:1,
	},

	//========Personal customs==========//
	wakeUpHour:{
		type:'number',columnType:'integer',
		defaultsTo: 730, //For 7:30
	},

	goToBedHour:{
		type:'number',columnType:'integer',
		defaultsTo: 2300
	},

	mealsNumber:{
		type:'number',columnType:'integer',
		defaultsTo: 5
	},

	eatingTimes:{
		type:'string',
		defaultsTo: '8:00, 12:00, 14:30, 17:00, 20:00'
	},

	canYouChangeDailyPlan:{
		type:'string',
		isIn: ['no', 'rather_no', 'rather_yes', 'yes']
	},

	canYouPrepareDishes:{
		type:'string',
		isIn: ['rather_no', 'maybe', 'yes']
	},

	canYouEatSameDaily:{
		type:'string',
		isIn: ['rather_no', 'maybe', 'yes']
	},

	allergy:{
		type:'string'
	},

	notEating:{
		type:'string'
	},

	preserveWeightProblems:{
		type:'boolean',
		defaultsTo:false
	},

	usedEatingPlans:{
		type:'string'
	},

	dailyCalories:{
		type:'number',columnType:'integer'
	},

	kitchenEquipment:{
		type:'number',columnType:'integer', //Using bit mask - 101001
		defaultsTo:0
	},

	workType:{
		type:'string'
	},

	hintsForTrainer:{
		type:'string',columnType:'text'
	},

	//==========Training survey===========//
	weight:{
		type:'number',columnType:'integer',
		defaultsTo:0
	},

	height:{
		type:'number',columnType:'integer',
		defaultsTo: 0
	},

	activity:{
		type:'string',
		isIn: ['little', 'normal', 'medium','many','very_much'],
		defaultsTo:'little'
	},

	bodySize:{
		model:'BodySize',
		required:true
	},

	gymExperience:{
		type:'string',
		isIn: ['never','sometimes','long_time','expert'],
		defaultsTo:'never'
	},

	trainingsStatus:{
		type:'string',
		isIn:['once','twice','three_four','more_than_four'],
		defaultsTo:'once'
	},

	trainingDescription:{
		type:'string',columnType:'text'
	},

	otherTrainings:{
		type:'string',columnType:'text'
	},

	currentStatus:{
		type:'string',
		isIn:['bad','worse','not_so_bad','better','good'],
		defaultsTo:'bad'
	},

	possibleTrainings:{
		type:'number',columnType:'integer',
		isIn:[1,2,3,4,5,6],
		defaultsTo:1
	},

	mostImportantBodyPart:{
		type:'string',
		isIn:['chest','legs','back','shoulders'
		,'biceps','triceps','belly','all'],
		defaultsTo:'belly'
	},

	availableEquipment:{
		type:'string',
		isIn:['gym','home','none'],
		defaultsTo:'gym'
	},

	currentNutrition:{
		type:'string',columnType:'text'
	},

	supplementsCost:{
		type:'number',columnType:'integer'
	},

	contusionCheckboxes:{
		type:'number',columnType:'integer', //Bit mask
		defaultsTo:0
	},

	contusionAdditional:{
		type:'string'
	},

	otherHints:{
		type:'string',columnType:'text'
	},

	bodyPicture:{
		type:'string'
	},

	medicalReportName:{
		type:'string'
	},

	medicalReporKey:{
		type:'string'
	}
  },

  	customToJSON: function() {
      var obj = {...this};
      if(!obj.allergy){
      	obj.allergy = null;
      }
      if(!obj.notEating){
      	obj.notEating = null;
      }
      if(!obj.dailyCalories){
      	obj.dailyCalories = null;
      }
      if(!obj.supplementsCost){
      	obj.supplementsCost = null;
      }
      if(!obj.usedEatingPlans){
      	obj.usedEatingPlans = null;
      }
      return obj;
    }
};
