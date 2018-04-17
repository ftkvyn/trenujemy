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
    qs.push(TrainPlan.find({isActive: true, id: cart.trainings || []}).populate('trainer'));
	if(cart.feedPlan){
		qs.push(FeedPlan.findOne({isVisible: true, id: cart.feedPlan}).populate('trainer'));
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
				//feedPlan.target = data[2];
				feedPlan.isFeedPlan = true;
				feedPlan.trainerId = feedPlan.trainer.id;
				cartItems.push(feedPlan);
			}
			const trainings = [];
			for(var i = 0; i < cart.trainings.length; i++){
				const training = data[0].find((item) => item.id == cart.trainings[i]);
				training.isTraining = true;
				training.trainerId = training.trainer.id;
				cartItems.push(training);
			}
			cartItems.push(...trainings);
			deferred.resolve(cartItems);
		}
		catch(ex){
			deferred.reject(ex);
		}
	});		
	return deferred.promise;
}

exports.purchaseItems = function(transactions){
	let deferred = Q.defer();
	let user = null;
	let feedPlanTransaction = null;
	let trainingTransactions = [];	
	for(let i =  0; i < transactions.length; i++){
		const transaction = transactions[i];		
		if(transaction.status != 'Complete'){
			return deferred.reject(new Error('Wrong transaction status - ' + transaction.status));
		}
		user = transaction.user;
		if(transaction.item.isFeedPlan){
			feedPlanTransaction = transaction;
		}else{
			trainingTransactions.push(transaction);
		}
	}
	

	let loadQs = [];
	let trainPlanIds = trainingTransactions.map(tt => tt.item.id);

	loadQs.push(TrainPlan.find({isActive: true, id: trainPlanIds}));
	loadQs.push(Notifications.findOne({user: user}));
	loadQs.push(TrainPlanPurchase.count({user: user}));
	loadQs.push(FeedPlanPurchase.count({user: user}));
	if(feedPlanTransaction){
		loadQs.push(FeedPlan.findOne({id: feedPlanTransaction.item.id}));
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
			let notificationModel = {user: user};
			notificationModel.newPurchase = true;
			for(let i = 0; i < trainingTransactions.length; i++){
				let plan = trainPlans.find( (item) => item.id == trainingTransactions[i].item.id);
				if(plan){
					qs.push(TrainPlanPurchase.create({
						user: trainingTransactions[i].user,
						transaction: trainingTransactions[i].id,
						plan: plan.id,
						trainsCount: plan.trainsCount,
						trainsLeft: plan.trainsCount,
						trainer: trainingTransactions[i].item.trainerId || 1,
						isActive: true
					}).fetch());	
					notificationModel.trainingInfo = true;
					if(!oldTrainsCount){
						notificationModel.updateSurvey = true;
					}
				}	
			}
			if(trainingTransactions.length && qs.length){
				//Updating all user active trainings to update valid period.
				let now = new Date();
				qs.push(TrainPlanPurchase.update({
					user: user,
					isActive: true,
					trainsLeft : {'>' : 0}
				},{ createdAt: now }).fetch());
			}
			if(feedPlanTransaction){
				qs.push(FeedPlanPurchase.create({
					user: user,
					transaction: feedPlanTransaction.id,
					plan: feedPlanTransaction.item.id,
					isActive: true,
					trainer: feedPlanTransaction.item.trainerId  || 1,
				}).fetch());
				notificationModel.feedInfo = true;
				if(feedPlan.isWithConsulting){
					notificationModel.consultInfo = true;
				}
				if(!oldFeedsCount){
					notificationModel.updateSurvey = true;
				}
			}
			qs.push(Notifications.update({id: oldNotification.id},notificationModel).fetch());
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