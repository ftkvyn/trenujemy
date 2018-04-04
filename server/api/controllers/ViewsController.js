/**
 * ViewsController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const Q = require('q');

module.exports = {
	home: function(req,res){
		return res.view('home', {locals: {
			user: req.session.user, 
			cart: req.session.cart,
		}});	
	},

	trainer: function(req, res){
		return res.view('trainerPage');
	},

	cart: function(req,res){
		cartService.initCart(req);
	    cartService.loadCartItems(req.session.cart)
		.catch(function(err){
			console.error(err);
			return res.view('cart', {locals: {
				user: req.session.user, 
				cartMessage: "Błąd przy ładowaniu koszyka",
				cart: req.session.cart,
				isApprove: false,
			}});
		})
		.then(function(cartItems){
			// console.log('controller - items');
			// console.log(cartItems);
			const cartMessage = req.session.cartMessage;
			req.session.cartMessage = undefined;
			return res.view('cart', {locals: {
				user: req.session.user, 
				cartMessage: cartMessage,
				cartItems: cartItems,
				cart: req.session.cart,
				isApprove: false,
			}});
		});		
	},

	cartApprove: function(req,res){
		FeedPlanPurchase.find({user: req.session.user.id, isActive: true})
		.exec(function(err, plans){
			if(err){
				console.error(err);
				return res.view('cart', {locals: {
					user: req.session.user, 
					cartMessage: "Błąd przy ładowaniu koszyka",
					cart: req.session.cart,
					isApprove: true,
				}});
			}
			if(!plans){
				plans = [];
			}
		    cartService.initCart(req);
		    if(req.session.cart.feedPlan){
		    	if(plans.length){
		    		req.session.cartMessage = 'Na tym koncie aktywna jest wybrana usługa. Nie możesz mieć równocześnie więcej niż jednej aktywnej usługi tego samego typu na jednym koncie';
		    		delete req.session.cart.feedPlan;
		    		delete req.session.cart.target;
		    		req.session.cart.totalItems --;
		    	}
		    }
		    cartService.loadCartItems(req.session.cart)
			.catch(function(err){
				console.error(err);
				return res.view('cart', {locals: {
					user: req.session.user, 
					cartMessage: "Błąd przy ładowaniu koszyka",
					cart: req.session.cart,
					isApprove: true,
				}});
			})
			.then(function(cartItems){
				// console.log('controller - items');
				// console.log(cartItems);
				const cartMessage = req.session.cartMessage;
				req.session.cartMessage = undefined;
				return res.view('cart', {locals: {
					user: req.session.user, 
					cartMessage: cartMessage,
					cartItems: cartItems,
					cart: req.session.cart,
					isApprove: true,
				}});
			});		
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

	registerTrainer: function(req,res){
		return res.view('auth/registerTrainer');	
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

