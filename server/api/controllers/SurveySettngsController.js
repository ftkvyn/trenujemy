/**
 * SurveySettngsController
 *
 * @description :: Server-side logic for managing Surveysettngs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const allFields = [
'bodyType',
'wakeUpHour',
'goToBedHour',
'mealsNumber',
'eatingTimes',
'canYouChangeDailyPlan',
'canYouPrepareDishes',
'canYouEatSameDaily',
'allergy',
'notEating',
'preserveWeightProblems',
'usedEatingPlans',
'dailyCalories',
'kitchenEquipment',
'workType',
'hintsForTrainer',

'weight',
'height',
'activity',

'bodySize.neck',
'bodySize.shoulder',
'bodySize.forearm',
'bodySize.wrist',
'bodySize.chest',
'bodySize.waist',
'bodySize.hips',
'bodySize.thigh',
'bodySize.shin',

'gymExperience',
'trainingsStatus',
'trainingDescription',
'otherTrainings',
'currentStatus',
'possibleTrainings',
'mostImportantBodyPart',
'availableEquipment',
'currentNutrition',
'supplementsCost',
'contusionCheckboxes',
'otherHints',
'bodyPicture',
'medicalReportName',
];

module.exports = {
	find:  function(req, res){
		SurveySettngs.find()
		.exec(function(err, data) {
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			if(data.length){
				return res.json(data);
			}
			const initSettings = [
				{
					settingType:'training',
					includedFields: [
						'bodyType',
						'dailyCalories',
						'workType',
						'hintsForTrainer',
						'weight',
						'height',
						'activity',
						'bodySize.neck',
						'bodySize.shoulder',
						'bodySize.forearm',
						'bodySize.wrist',
						'bodySize.chest',
						'bodySize.waist',
						'bodySize.hips',
						'bodySize.thigh',
						'bodySize.shin',
						'gymExperience',
						'trainingsStatus',
						'trainingDescription',
						'otherTrainings',
						'currentStatus',
						'possibleTrainings',
						'mostImportantBodyPart',
						'availableEquipment',
						'currentNutrition',
						'supplementsCost',
						'contusionCheckboxes',
						'otherHints',
						'bodyPicture',
						'medicalReportName',
						]
				},{
					settingType:'feed',
					includedFields: ['bodyType',
						'wakeUpHour',
						'goToBedHour',
						'mealsNumber',
						'eatingTimes',
						'canYouChangeDailyPlan',
						'canYouPrepareDishes',
						'canYouEatSameDaily',
						'allergy',
						'notEating',
						'preserveWeightProblems',
						'usedEatingPlans',
						'dailyCalories',
						'kitchenEquipment',
						'workType',
						'hintsForTrainer',
						'weight',
						'height',
						'activity',
						]
				}
			];
	        SurveySettngs.create(initSettings)
	        .exec(function(err, data) {
				if(err){
					console.error(err);
					return res.badRequest(err);
				}
				return res.json(data);
			});
		});
	}
};

