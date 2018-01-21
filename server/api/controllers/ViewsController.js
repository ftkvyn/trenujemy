/**
 * ViewsController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const Q = require('q');

module.exports = {
	home: function(req,res){
		let qs = [];
		qs.push(TrainPlan.find({isActive: true}));
		qs.push(FeedPlan.find({isVisible: true}));
		qs.push(FeedPlanTarget.find({isVisible: true}));
		Q.all(qs)
		.catch(function(err){
			console.error(err);
			return res.view('homepage', {locals: {
				user: req.session.user,
				cart: req.session.cart, 
				trainPlans: [],
				feedPlans: [],
				feedPlanTarget: []
			}});	
		})
		.done(function(data){
			const rawPlans =  data[1];
			let plans = [];
			for(let i = 0; i < rawPlans.length; i++){
				let plan = plans.find( (item) => item.months == rawPlans[i].months );
				if(!plan){
					plan = rawPlans[i];
					plans.push(plan);
				}
				if(rawPlans[i].isWithConsulting){
					plan.consult = rawPlans[i];
				}else{
					plan.noConsult = rawPlans[i];
				}
			}
			return res.view('homepage', {locals: {
				user: req.session.user, 
				cart: req.session.cart,
				trainPlans: data[0],
				feedPlans: plans,
				feedPlanTarget: data[2]
			}});	
		});	
	},

	about: function(req,res){
		return res.view('about', {locals: {user: req.session.user}});	
	},

	history: function(req,res){
		return res.view('history', {locals: {user: req.session.user}});	
	},

	training: function(req,res){
		return res.view('training', {locals: {user: req.session.user}});	
	},

	plans: function(req,res){
		return res.view('plans', {locals: {user: req.session.user}});	
	},

	cart: function(req,res){
		if(!req.session.cart){
	    	req.session.cart = {
	    		totalItems:0
	    	};
	    }
		return res.view('cart', {locals: {user: req.session.user, cart: req.session.cart}});	
	},

	login: function(req,res){
		if(req.query.returnUrl){
			req.session.returnUrl = decodeURIComponent(req.query.returnUrl);
		}
		return res.view('auth/login');	
	},

	activate:function(req,res){
		return res.view('auth/activate', {locals : {}});	
	},

	recoverPassword: function(req,res){
		return res.view('auth/recoverPassword', {locals : {}});	
	},

	changePassword: function(req,res){
		return res.view('auth/changePassword', {locals : {code: req.query.code}});	
	},

	dashboard: function(req,res){
		return res.view('dashboard', {layout: null, locals: {user: req.session.user}});	
	}
};

