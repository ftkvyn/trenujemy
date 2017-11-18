/**
 * ViewsController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	home: function(req,res){
		return res.view('homepage', {layout: 'assanLayout'});	
	},

	login: function(req,res){
		return res.view('login', {layout: 'assanLayout'});	
	},

	register: function(req,res){
		return res.view('register', {layout: 'assanLayout'});	
	},

	trainer: function(req,res){
		return res.view('homepage', {layout: 'assanLayout'});	
	},

	user: function(req,res){
		return res.view('homepage', {layout: 'assanLayout'});	
	},
};

