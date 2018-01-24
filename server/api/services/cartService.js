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
		deferred.reject(new Error(error));
	})
	.done(function(data){
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