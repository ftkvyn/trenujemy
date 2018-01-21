// CartController
const Q = require('q');

function calculateTotalItems(cart){
	cart.totalItems = 0;
	if(cart.feedPlan){
		cart.totalItems ++;
	}
	if(cart.trainings && cart.trainings.length){
		cart.totalItems += cart.trainings.length;
	}
	return cart;
}

module.exports = {
	addItem: function (req, res){
	    if(!req.session.cart){
	    	req.session.cart = {
	    		totalItems:0
	    	};
	    }
	    //req.session.cartMessage = 'Testing error';
	    if(req.body.feedPlan){
	    	//ToDo: check if user have existing feed plan.
	    	if(req.session.cart.feedPlan){
	    		req.session.cartMessage = 'Nie możesz zakupić jednocześnie więcej niż jednej usługi tego samego typu dla jednego konta';
	    	}
	    	req.session.cart.feedPlan = req.body.feedPlan;
	    	req.session.cart.target = req.body.target;
	    }
	    if(req.body.trainingPlan){
	    	if(!req.session.cart.trainings){
	    		req.session.cart.trainings = [];
	    	}
	    	req.session.cart.trainings.push(req.body.trainingPlan);
	    }
	    calculateTotalItems(req.session.cart);
	    res.redirect('/cart');
	},

	removeItem: function (req, res){
	    if(req.body.feedPlan){
	    	delete req.session.cart.feedPlan;
	    	delete req.session.cart.target;
	    }
	    if(req.body.trainingPlan){
	    	if(req.session.cart.trainings){
	    		const index = req.session.cart.trainings.findIndex( (item) => item == req.body.trainingPlan);
	    		req.session.cart.trainings.splice(index, 1);
	    	}
	    }  
	    calculateTotalItems(req.session.cart); 
	    res.redirect('/cart');
	}
}