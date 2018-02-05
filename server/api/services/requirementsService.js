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

exports.checkUserRequirements = function(userId) {
	let deferred = Q.defer();

	let initQs = [];

	initQs.push(UserRequirement.find({user: userId}));
	initQs.push(FeedPlanPurchase.find({user: userId, isActive: true}));

	Q.all(initQs)
	.catch(function(err){
		deferred.reject(new Error(err));
	})
	.then(function(data){
		//Not working yet
		return deferred.resolve({});
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
		let requirement = requirementDayAgo[minRequirementNum];
		if(!requirement || !requirement[1]){
			console.log('no requirements');
			return deferred.resolve({});
		}
		console.log(requirementDayAgo[minRequirementNum]);
		let searchDate = moment().startOf('day')
			.subtract(requirement[1][0], requirement[1][1])
			.add(1, 'hours') //fix for some fucking stupid timezone shit
			.toDate();
		// if(searchDate < feedPlan.createdAt){
		// 	console.log('feed plan is too new');
		// 	return deferred.resolve({});
		// }
		DailyReport.find({user: userId, date: {'>=' : searchDate}})
		.populate('bodySize')
		.sort('date DESC')
		.exec(function(err, reports){
			if(err){
				return deferred.reject(new Error(err));
			}
			let result = {};
			if(userRequirement.provideWeight && userRequirement.provideWeight != 'never'){
				let limit = requirementDayAgo.find( item => item[0] == userRequirement.provideWeight);
				let limitDate = moment().startOf('day').subtract(limit[1][0], limit[1][1]).add(1, 'hours').toDate();
				let weightProvided = false;
				for(let i = 0; i < reports.length; i++){
					if(reports[i].date <= limitDate){
						if(reports[i].weight){
							weightProvided = true;
							break;
						}
					}
				}
				if(!weightProvided){
					if(limitDate > feedPlan.createdAt){
						result.weight = {
							notProvided: true,
							lastDate: limitDate
						};
					}
				}
			}
			if(userRequirement.provideSizes && userRequirement.provideSizes != 'never'){
				let limit = requirementDayAgo.find( item => item[0] == userRequirement.provideWeight);
				let limitDate = moment().startOf('day').subtract(limit[1][0], limit[1][1]).add(1, 'hours').toDate();
				let sizesProvided = [];
				for(let i = 0; i < reports.length; i++){
					if(reports[i].date <= limitDate){
						if(reports[i].bodySize){
							for(let k = 0; k < bodySizes.length; k++){
								let sizeKey = bodySizes[k];
								if(reports[i].bodySize[sizeKey]){
									if(!sizesProvided.some( item => item == sizeKey)){
										sizesProvided.push(sizeKey);
									}
								}
							}
						}
					}
				}
				if(sizesProvided.length != bodySizes.length){
					let notProvidedSizes = bodySizes.filter( bodySize => !sizesProvided.some(sizeProvided => bodySize == sizeProvided));
					if(limitDate > feedPlan.createdAt){
						result.bodySize = {
							notProvided: notProvidedSizes,
							lastDate: limitDate
						};
					}
				}
			}
			if(userRequirement.providePhoto && userRequirement.providePhoto != 'never'){
				let limit = requirementDayAgo.find( item => item[0] == userRequirement.providePhoto);
				let limitDate = moment().startOf('day').subtract(limit[1][0], limit[1][1]).add(1, 'hours').toDate();
				let photoProvided = false;
				for(let i = 0; i < reports.length; i++){
					if(reports[i].date <= limitDate){
						if(reports[i].image){
							photoProvided = true;
							break;
						}
					}
				}
				if(!photoProvided){
					if(limitDate > feedPlan.createdAt){
						result.image = {
							notProvided: true,
							lastDate: limitDate
						};
					}
				}
			}		
			deferred.resolve(result);	
		})
	})
	//deferred.reject(new Error(err));
	//deferred.resolve(cartItems);
	return deferred.promise;
}