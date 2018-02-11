const Q = require('q');


exports.initCart = function(req, isForce){
	if(!req.session.cart || isForce){
    	req.session.cart = {
    		totalItems:0,
    		trainings: []
    	};
    }
    if(!req.session.cart.trainings){
    	req.session.cart.trainings = [];
    }
}


exports.loadCartItems = function(cart){
	let deferred = Q.defer();
	let qs = [];
	// console.log(cart);
    qs.push(TrainPlan.find({isActive: true, id: cart.trainings || []}));
	if(cart.feedPlan){
		qs.push(FeedPlan.findOne({isVisible: true, id: cart.feedPlan}));
		qs.push(FeedPlanTarget.findOne({isVisible: true, id: cart.target}));
	}
	Q.all(qs)
	.catch(function(err){
		console.log('error');
		deferred.reject(new Error(err));
	})
	.then(function(data){
		// console.log(data);
		try{
			let cartItems = [];
			const feedPlan = data[1];
			if(feedPlan){
				feedPlan.target = data[2];
				feedPlan.isFeedPlan = true;
				cartItems.push(feedPlan);
			}
			const trainings = [];
			for(var i = 0; i < cart.trainings.length; i++){
				const training = data[0].find((item) => item.id == cart.trainings[i]);
				cartItems.push(training);
			}
			cartItems.push(...trainings);
			// console.log('items');
			// console.log(cartItems);
			deferred.resolve(cartItems);
		}
		catch(ex){
			deferred.reject(ex);
		}
	});		
	return deferred.promise;
}

exports.purchaseItems = function(transaction){
	let deferred = Q.defer();
	const cart = transaction.cart;
	if(transaction.status != 'Complete'){
		deferred.reject(new Error('Wrong transaction status - ' + transaction.status));
	}

	let loadQs = [];

	loadQs.push(TrainPlan.find({isActive: true, id: cart.trainings || []}));
	loadQs.push(Notifications.findOne({user: transaction.user}));
	loadQs.push(TrainPlanPurchase.count({user: transaction.user}));
	loadQs.push(FeedPlanPurchase.count({user: transaction.user}));
	if(cart.feedPlan){
		loadQs.push(FeedPlan.findOne({id: cart.feedPlan}));
	}

	Q.all(loadQs)
	.catch(function(err){
		deferred.reject(new Error(err));
	})
	.then(function(data){
		try{
			let trainPlans = data[0];
			let oldNotification = data[1];
			let oldTrainsCount = data[2];
			let oldFeedsCount = data[3];
			let feedPlan = data[4];
			
			let qs = [];
			let notificationModel = {user: transaction.user};
			notificationModel.newPurchase = true;
			for(let i = 0; i < cart.trainings.length; i++){
				let plan = trainPlans.find( (item) => item.id == cart.trainings[i]);
				if(plan){
					qs.push(TrainPlanPurchase.create({
						user: transaction.user,
						transaction: transaction.id,
						plan: cart.trainings[i],
						trainsCount: plan.trainsCount,
						trainsLeft: plan.trainsCount,
						isActive: true
					}));	
					// if(typeof oldNotification.trainingInfo != 'boolean'){
						notificationModel.trainingInfo = true;
					// }
					if(!oldTrainsCount){
						notificationModel.updateSurvey = true;
					}
				}	
			}
			if(cart.trainings.length && qs.length){
				//Updating all user active trainings to update valid period.
				let now = new Date();
				qs.push(TrainPlanPurchase.update({
					user: transaction.user,
					isActive: true,
					trainsLeft : {'>' : 0}
				},{ createdAt: now }));
			}
			if(cart.feedPlan){
				qs.push(FeedPlanPurchase.update({user: transaction.user}, {isActive: false}));
				qs.push(FeedPlanPurchase.create({
					user: transaction.user,
					transaction: transaction.id,
					plan: cart.feedPlan,
					target: cart.target,
					isActive: true
				}));
				// if(typeof oldNotification.feedInfo != 'boolean'){
					notificationModel.feedInfo = true;
				// }
				if(feedPlan.isWithConsulting){
					// if(typeof oldNotification.consultInfo != 'boolean'){
						notificationModel.consultInfo = true;
					// }
				}
				if(!oldFeedsCount){
					notificationModel.updateSurvey = true;
				}
			}
			qs.push(Notifications.update({id: oldNotification.id},notificationModel));
			Q.all(qs)
			.catch(function(err){
				deferred.reject(new Error(err));
			})
			.then(function(data){
				deferred.resolve(data);
			});	
		}
		catch(err){
			deferred.reject(err);	
		}	
	});
	return deferred.promise;
}