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

	trainings: function(req,res){
		let qs = [];
		qs.push(TrainPlaces.find({}));
		qs.push(TrainTimes.find({}));
		Q.all(qs)
		.catch(function(err){
			console.error(err);
			return res.view('training', {locals: {
				user: req.session.user,
				places: [],
				times: []
			}});	
		})
		.done(function(data){
			return res.view('training', {locals: {
				user: req.session.user,
				places: data[0],
				times: data[1]
			}});	
		});	
			
	},

	plans: function(req,res){
		return res.view('plans', {locals: {user: req.session.user}});	
	},

	cart: function(req,res){
		cartService.initCart(req);
	    cartService.loadCartItems(req.session.cart)
		.catch(function(err){
			console.error(err);
			return res.view('cart', {locals: {
				user: req.session.user, 
				cartMessage: "Błąd przy ładowaniu koszyka",
				cart: req.session.cart}});
		})
		.done(function(cartItems){
			const cartMessage = req.session.cartMessage;
			req.session.cartMessage = undefined;
			return res.view('cart', {locals: {
				user: req.session.user, 
				cartMessage: cartMessage,
				cartItems: cartItems,
				cart: req.session.cart}});
		});		
	},

	paymentEnd: function(req,res){
		return res.view('cart', {locals: {
				user: req.session.user, 
				cartSuccessMessage: "Dziękujemy za dokonanie zakupu. Zaraz po zaksięgowaniu Twojej wpłaty otrzymasz dostęp do panelu klienta",
				cartItems: [],
				cart: req.session.cart}});
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
	},

	contact:function(req,res){
		emailService.sendContactMail(req.body);
		return res.send('Ok');
	}
};

