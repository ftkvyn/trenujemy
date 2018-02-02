const Q = require('q');


exports.initCart = function(req, isForce){
	if(!req.session.cart || isForce){
    	req.session.cart = {
    		totalItems:0,
    		trainings: []
    	};
    }
}


exports.loadCartItems = function(cart){
	let deferred = Q.defer();
	let qs = [];
    qs.push(TrainPlan.find({isActive: true, id: cart.trainings || []}));
	if(cart.feedPlan){
		qs.push(FeedPlan.findOne({isVisible: true, id: cart.feedPlan}));
		qs.push(FeedPlanTarget.findOne({isVisible: true, id: cart.target}));
	}
	Q.all(qs)
	.catch(function(err){
		deferred.reject(new Error(err));
	})
	.then(function(data){
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
		deferred.resolve(cartItems);
	});		
	return deferred.promise;
}

exports.purchaseItems = function(transaction){
	let deferred = Q.defer();
	const cart = transaction.cart;
	if(transaction.status != 'Complete'){
		deferred.reject(new Error('Wrong transaction status - ' + transaction.status));
	}

	TrainPlan.find({isActive: true, id: cart.trainings || []})
	.exec(function(err, trainPlans){
		if(err){
			return deferred.reject(err);
		}

		let qs = [];
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
			}	
		}
		if(cart.trainings.length && qs.length){
			//Updating all user active trainings to update valid period.
			qs.push(TrainPlanPurchase.update({
				user: transaction.user,
				isActive: true,
				//trainsLeft : {'>' : 0}
			},{}));
		}
		if(cart.feedPlan){
			qs.push(FeedPlanPurchase.update({user: transaction.user.id, isActive: false}));
			qs.push(FeedPlanPurchase.create({
				user: transaction.user,
				transaction: transaction.id,
				plan: cart.feedPlan,
				target: cart.target,
				isActive: true
			}));
		}
		Q.all(qs)
		.catch(function(err){
			deferred.reject(new Error(err));
		})
		.then(function(data){
			deferred.resolve(data);
		});		
	});
	return deferred.promise;
}