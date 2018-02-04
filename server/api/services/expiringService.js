const Q = require('q');
const moment = require('moment');

exports.expirePlans = function(){

	let now = moment().startOf('day').toDate();
	let loadQs = [];

	loadQs.push(FeedPlanPurchase.find({isActive: true}).populate('plan'));
	loadQs.push(TrainPlanPurchase.find({isActive: true, trainsLeft: {'>':0}}).populate('plan'));

	Q.all(loadQs)
	.catch(function(err){
		if(err){
			console.error('Error expiring plans');
			console.error(err);
		}
	})
	.then(function(data){
		const feedPlans = data[0];
		const trainPlans = data[1];
		let updateQs = [];
		for(let i = 0; i < feedPlans.length; i++){
			let feedPlan = feedPlans[i].toJSON();
			if(feedPlan.validTo < now){
				updateQs.push(FeedPlanPurchase.update({id: feedPlan.id}, {isActive: false}));
			}
		}
		for(let i = 0; i < trainPlans.length; i++){
			let trainPlan = trainPlans[i].toJSON();
			if(trainPlan.validTo < now){
				updateQs.push(TrainPlanPurchase.update({id: trainPlan.id}, {isActive: false}));
			}
		}
		Q.all(updateQs)
		.catch(function(err){
			if(err){
				console.error('Error expiring plans');
				console.error(err);
			}
		})
		.then(function(data){
			if(data && data.length){
				console.log('expired enitites:');
				console.log(data);
			}
		});
	});
}