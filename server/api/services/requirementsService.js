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

	UserRequirement.find({user: userId})
	.exec(function(err, data){
		if(err){
			return deferred.reject(new Error(err));
		}
		if(!data || !data.length){
			deferred.resolve({});
		}
		let userRequirement = data[0];

		let minRequirementNum = 0;
		let reqKeys = ['provideWeight','provideSizes','providePhoto'];
		for (var i = reqKeys.length - 1; i >= 0; i--) {
			let key = reqKeys[i];
			let index = requirementDayAgo.findIndex( item => item[0] == userRequirement[key]);
			if(index > 0 && minRequirementNum < index){
				minRequirementNum = index;
			}
		}
		let requirement = requirementDayAgo[minRequirementNum];
		console.log(requirementDayAgo[minRequirementNum]);
		let searchDate = moment(0, "HH").subtract(requirement[1][0], requirement[1][1]).toDate();
		DailyReport.find({user: userId, date: {'>' : searchDate}})
		.populate('bodySize')
		.sort('date DESC')
		.exec(function(err, reports){
			if(err){
				return deferred.reject(new Error(err));
			}
			let result = {};
			if(userRequirement.provideWeight && userRequirement.provideWeight != 'never'){
				let limit = requirementDayAgo.findIndex( item => item[0] == userRequirement.provideWeight);
				let limitDate = moment(0, "HH").subtract(limit[1][0], limit[1][1]).toDate();
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
					result.weight = {
						notProvided: true,
						lastDate: limitDate
					};
				}
			}
			if(userRequirement.provideSizes && userRequirement.provideSizes != 'never'){
				let limit = requirementDayAgo.findIndex( item => item[0] == userRequirement.provideWeight);
				let limitDate = moment(0, "HH").subtract(limit[1][0], limit[1][1]).toDate();
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
					result.bodySize = {
						notProvided: notProvidedSizes,
						lastDate: limitDate
					};
				}
			}
			if(userRequirement.providePhoto && userRequirement.providePhoto != 'never'){
				let limit = requirementDayAgo.findIndex( item => item[0] == userRequirement.providePhoto);
				let limitDate = moment(0, "HH").subtract(limit[1][0], limit[1][1]).toDate();
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
					result.image = {
						notProvided: true,
						lastDate: limitDate
					};
				}
			}		
			deferred.resolve(result);	
		})
	})
	//deferred.reject(new Error(err));
	//deferred.resolve(cartItems);
	return deferred.promise;
}