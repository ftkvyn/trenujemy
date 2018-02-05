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
	              req.session.returnUrl = null;
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
	    req.session.cart = {};
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
	                  		emailService.sendActivationMail(user); 
	                  		Notifications.create({user: user.id, helloMessage: true})
	                  		.exec(function(){});    	
	                    	return res.send({success: true});
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
		if(!req.query.activationCode){
			return res.view('activate', {locals : {noUser: true}});	
		}
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
		            return res.view('activate', {locals : {activated: true}});	
	        	});
	    	});
	},

	recoverPassword:function(req,res){
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
	          }
	          if(!user.isActive){
              	return res.send({
	              success: false,
	              notActive: true
	            });
              }
              var code = generateRandomStr(12);
              User.update({id: user.id}, {passwordRecoveryKey: code})
	        	.exec(function(err, users){
	        		if(err){
		        		console.error(err);
		        		return res.send({error: err});
		        	}	
		        	emailService.sendPasswordRecoveryMail(users[0]);
		        	return res.send({
		              success: true
		            });
	        	});
	    });
	},

	changePassword:function(req,res){
		User.findOne({passwordRecoveryKey:req.body.code}).exec(
	        function(err,user){
	        	if(err){
	        		console.error(err);
	        		return res.send({success:false, error: err});
	        	}
	        	if(!user){
	        		return res.send({success:false, noUser: true});
	        	}
	        	bcrypt.genSalt(10, function(err, salt) {
	            bcrypt.hash(req.body.password, salt, function(err, hash) {
		              	if (err) {
		                	console.error(err);
	        				return res.send({success:false, error: err});
		                }
						User.update({id: user.id}, {password: hash, passwordRecoveryKey: null})
						.exec(function(err, users){
							if(err){
								console.error(err);
	        					return res.send({success:false, error: err});	
							}
		                  	return res.send({success: true});
	          			});
	        		});
				});
	    	});
	},
};

