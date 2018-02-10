//requirementsService
const Q = require('q');
const moment = require('moment');

const requirementDayAgo = [
 ['never',null],
 ['monthly', [1, 'months']],
 ['each_second_week', [2, 'weeks']],
 ['weekly', [2, 'weeks']],
 ['each_third_day', [3, 'days']],
 ['each_second_day', [2, 'days']],
 ['each_day', [1, 'days']],
 ];

const bodySizes = [
'neck',
'shoulder',
'forearm',
'wrist',
'chest',
'waist',
'hips',
'thigh',
'shin',
];

function checkRequirement(config, checkDayCb){
	let result = {};
	let limit = requirementDayAgo.find( item => item[0] == config.requirement);
	// console.log('');
	// console.log('req for weight');
	// console.log(limit);
	let limitDateMoment = config.momentDate.clone().subtract(limit[1][0], limit[1][1]);
	let limitDate = limitDateMoment.toDate();
	// console.log(limitDate);
	let dataProvided = false;
	let lastMissingDate = null;
	for(let i = 0; i < config.reports.length; i++){
		// console.log('');
		// console.log('checking report for day:');
		// console.log(config.reports[i].date);
		if(config.reports[i].date >= limitDate){
			let checkDayResult = checkDayCb(config.reports[i]);
			if(checkDayResult.passes){
				dataProvided = true;
				// console.log('got weight!');
				break;
			}else{
				if(checkDayResult.missingDay){
					lastMissingDate = checkDayResult.missingDay;
				}
			}
		}
	}
	if(!dataProvided){
		// console.log('');
		// console.log('no weight, checking feedPlan.createdAt');
		// console.log(limitDate);
		// console.log(config.feedPlan.createdAt);
		if(limitDate >= config.feedPlan.createdAt){
			result = {
				notProvided: true,
				lastDate: limitDate
			};
			if(lastMissingDate){
				result.missingDay = lastMissingDate;
			}
		}else{
			// console.log('feed plan is too new for weight');
		}
	}	
	return result;
}

exports.checkUserRequirements = function(userId, momentDate) {
	let deferred = Q.defer();

	let initQs = [];
	let jsDate = momentDate.toDate();
	// console.log('checking requirements for date:');
	// console.log(momentDate);
	// console.log(jsDate);
	// console.log(userId);

	initQs.push(UserRequirement.find({user: userId}));
	initQs.push(FeedPlanPurchase.find({user: userId, isActive: true}));

	Q.all(initQs)
	.catch(function(err){
		deferred.reject(new Error(err));
	})
	.then(function(data){
		let reqData = data[0];
		let feedPlans = data[1];
		if(!reqData || !reqData.length){
			return deferred.resolve({});
		}
		if(!feedPlans || !feedPlans.length){
			return deferred.resolve({});
		}
		let userRequirement = reqData[0];
		let feedPlan = feedPlans[0];

		let minRequirementNum = 100;
		let reqKeys = ['provideWeight','provideSizes','providePhoto'];
		for (var i = reqKeys.length - 1; i >= 0; i--) {
			let key = reqKeys[i];
			let index = requirementDayAgo.findIndex( item => item[0] == userRequirement[key]);
			if(index > 0 && minRequirementNum > index){
				minRequirementNum = index;
			}
		}
		// console.log('fahrest requirement:');
		// console.log(requirementDayAgo[minRequirementNum]);
		let requirement = requirementDayAgo[minRequirementNum];
		if(!requirement || !requirement[1]){
			// console.log('no requirements');
			return deferred.resolve({});
		}
		let fahrestDateMoment = momentDate
			.clone()
			.subtract(requirement[1][0], requirement[1][1]);

		let fahrestDateJs = fahrestDateMoment.toDate();

		// console.log('fahrest date:')
		// console.log(fahrestDateMoment);
		// console.log(fahrestDateJs);

		DailyReport.find({user: userId, date: {'>=' : fahrestDateJs}})
		.populate('bodySize')
		.sort('date DESC')
		.exec(function(err, reports){
			if(err){
				return deferred.reject(new Error(err));
			}
			let result = {};
			if(userRequirement.provideWeight && userRequirement.provideWeight != 'never'){
				let weightResult = checkRequirement({
					requirement: userRequirement.provideWeight,
					momentDate: momentDate,
					reports: reports,
					feedPlan: feedPlan
				}, dayReport => { return {passes:!!dayReport.weight}} );
				if(weightResult.notProvided){
					result.weight = weightResult;
				}
			}
			if(userRequirement.providePhoto && userRequirement.providePhoto != 'never'){
				let imageResult = checkRequirement({
					requirement: userRequirement.providePhoto,
					momentDate: momentDate,
					reports: reports,
					feedPlan: feedPlan
				}, dayReport => { return { passes: !!dayReport.image}} );
				if(imageResult.notProvided){
					result.image = imageResult;
				}
			}
			if(userRequirement.provideSizes && userRequirement.provideSizes != 'never'){
				let sizesResult = checkRequirement({
					requirement: userRequirement.provideSizes,
					momentDate: momentDate,
					reports: reports,
					feedPlan: feedPlan
				}, dayReport => {
					if(dayReport.bodySize){
						let sizesProvided = [];
						for(let k = 0; k < bodySizes.length; k++){
							let sizeKey = bodySizes[k];
							if(dayReport.bodySize[sizeKey]){
								if(!sizesProvided.some( item => item == sizeKey)){
									sizesProvided.push(sizeKey);
								}
							}
						}
						let notProvidedSizes = bodySizes.filter( bodySize => !sizesProvided.some(sizeProvided => bodySize == sizeProvided));
						if(notProvidedSizes.length){
							return { passes: false, missingDay: dayReport.date };
						}else{
							return { passes : true};
						}
					}
				} );
				if(sizesResult.notProvided){
					result.bodySize = sizesResult;
				}
			}
			deferred.resolve(result);	
		})
	})
	//deferred.reject(new Error(err));
	//deferred.resolve(cartItems);
	return deferred.promise;
}