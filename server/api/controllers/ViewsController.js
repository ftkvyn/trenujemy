/**
 * ViewsController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	home: function(req,res){
		return res.view('homepage', {locals: {user: req.session.user}});	
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
		return res.view('cart', {locals: {user: req.session.user}});	
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
		if(!req.session.user){
			return res.redirect('/');
		}
		return res.view('dashboard', {layout: null});	
	}
};

