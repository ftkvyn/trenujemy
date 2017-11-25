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
		return res.view('activate', {locals : {}});	
	},

	recoverPassword: function(req,res){
		return res.view('login');	
	},

	changePassword: function(req,res){
		return res.view('login');	
	},

	dashboard: function(req,res){
		return res.view('dashboard', {layout: null});	
	}
};

