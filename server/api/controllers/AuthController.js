/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt');
const symbols = '1234567890qwertyuiopasdfghjklzxcvbnm';

function generateRandomStr(length){
	var str = '';
	for (var i = length - 1; i >= 0; i--) {
		var key = Math.random() * symbols.length;
		key = Math.floor(key);
		str += symbols[key];
	}
	return str;
}

module.exports = {

	login:function(req,res){
		var password = req.body.password;
	    User.findOne({login:req.body.login}).exec(
	        function(err,user){
	          if(err){
	            console.error(err);
	            return res.send({error: err});
	          }
	          if(!user){
	            return res.send({
	              success: false,
	              notFound: true
	            });
	          }else{
	            //check password here.
	            bcrypt.compare(password, user.password, function(err, result) {
	              if (!result){ 
	                return res.send({
	                  success: false,
	                  notFound: true
	                });
	              }
	              if(!user.isActive){
	              	return res.send({
		              success: false,
		              notActive: true
		            });
	              }
	              req.session.user = user;
	              var url = req.session.returnUrl || '/dashboard';
	              return res.send({
		              success: true,
		              url: url
		            });
	            });
	          }
	    });
	},

	logout: function (req, res){
	    req.session.user = null;
	    res.redirect('/');
	},

	register:function(req,res){
		User.find({login: req.body.login})
		.exec(function(err, users){
			if(err){
				console.error(err);
				return res.send({error: err});
			}
			if(users && users.length){
				return res.send({emailUsed: true});
			}
			bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
	              	if (err) {
	                	console.error(err);
	                	return res.badRequest('Error.');
	                }
	                var key = generateRandomStr(10);
	                console.log('code = ' + key);
	        		var userData = {
						login: req.body.login,
						password: hash,
						isActive: false,
						activationCode: key,
						role:'user'
					};    
					User.create(userData).exec(function (err, user) {
						if(err){
							console.error(err);
	                		return res.badRequest('Error.');		
						}
	                  	if (user) {            	              
	                  		//ToDo: send activation email.      	
	                    	return res.send({succeess: true});
          				}else{
          					console.error('No user created');
          					return res.badRequest('Error.');	
          				}
          			});
        		});
			});
		});

	},

	activate:function(req,res){
		User.findOne({activationCode:req.query.activationCode}).exec(
	        function(err,user){
	        	if(err){
	        		console.error(err);
	        		return res.view('error');
	        	}
	        	if(!user){
	        		return res.view('activate', {locals : {noUser: true}});	
	        	}
	        	User.update({id: user.id}, {activationCode: null, isActive: true})
	        	.exec(function(err, users){
	        		if(err){
		        		console.error(err);
		        		return res.view('error');
		        	}	
		        	req.session.user = user;
		            var url = req.session.returnUrl;
		            if(url){
		            	req.session.returnUrl = null;
		            	return res.redirect(url);
		            }
		            return res.redirect('/dashboard');
	        	});
	    	});
	},

	recoverPassword:function(req,res){

	},

	changePassword:function(req,res){

	},
};

