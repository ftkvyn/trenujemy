/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt');

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
	              if(user.role == 'admin'){
	          		req.session.admin = user;	          		
	              }else{
	              	req.session.admin = null;
	              }
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

	adminImpersonate:function(req, res){
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
	            req.session.user = user;
                var url = req.session.returnUrl || '/dashboard';
                req.session.returnUrl = null;
                return res.send({
	                success: true,
	                url: url
	            });
	          }
	    });
	},

	logout: function (req, res){
	    req.session.user = null;
	    req.session.cart = {};
	    req.session.admin = false;
	    res.redirect('/');
	},

	register:function(req,res){
		registerService.registerUser(req.body, {role: 'user'})
		.then(function(user){
			return res.send({success: true});
		})
		.catch(function(errorModel){
			console.error(errorModel);
			return res.send(errorModel);
		});
	},

	registerTrainer:function(req,res){
		registerService.registerUser(req.body, {role: 'trainer'})
		.then(function(user){
			registerService.initTrainer(user)
			.then(function(data){
				return res.send({success: true});
			})
			.catch(function(errorModel){
				//ToDo: remove user?
				console.error(errorModel);
				return res.send(errorModel);
			});
		})
		.catch(function(errorModel){
			console.error(err);
			return res.send(errorModel);
		});
	},

	activate:function(req,res){
		console.log(req.query.activationCode);
		if(!req.query.activationCode){
			return res.view('auth/activate', {locals : {noUser: true}});	
		}
		User.findOne({activationCode:req.query.activationCode}).exec(
	        function(err,user){
	        	if(err){
	        		console.error(err);
	        		return res.view('error');
	        	}
	        	if(!user){
	        		return res.view('auth/activate', {locals : {noUser: true}});	
	        	}
	        	User.update({id: user.id}, {isActive: true})
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
		            return res.view('auth/activate', {locals : {activated: true}});	
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
              var code = registerService.generateRandomStr(12);
              User.update({id: user.id}, {passwordRecoveryKey: code})
                .fetch()
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

