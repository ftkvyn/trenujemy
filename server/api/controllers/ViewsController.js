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

	login: function(req,res){
		if(req.query.returnUrl){
			req.session.returnUrl = decodeURIComponent(req.query.returnUrl);
		}
		return res.view('login');	
	},

	activate:function(req,res){
		var user = {
			login : 'ftkvyn@gmail.com',
			activationCode: '6fm0xg3ho4'
		};
		emailService.sendActivationMail(user);  
		return res.view('activate', {locals : {}});	
	},

	recoverPassword: function(req,res){
		return res.view('recoverPassword', {locals : {}});	
	},

	changePassword: function(req,res){
		return res.view('changePassword', {locals : {code: req.query.code}});	
	},

	dashboard: function(req,res){
		if(!req.session.user){
			return res.redirect('/');
		}
		return res.view('dashboard', {layout: null});	
	}
};

