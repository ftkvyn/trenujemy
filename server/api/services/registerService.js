const Q = require('q');
const bcrypt = require('bcrypt');
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

exports.generateRandomStr = generateRandomStr;

exports.registerUser = function(model, options){
	let deferred = Q.defer();
	User.find({login: model.login})
	.exec(function(err, users){
		if(err){
			console.error(err);
			return deferred.reject({error: err});
		}
		if(users && users.length){
			return deferred.reject({emailUsed: true});
		}
		bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(model.password, salt, function(err, hash) {
              	if (err) {
                	console.error(err);
                	return deferred.reject('Error.');
                }
                var key = generateRandomStr(10);
        		var userData = {
					login: model.login,
					password: hash,
					isActive: false,
					activationCode: key,
					role:options.role
				};    
				if(model.phone){
					userData.phone = model.phone;
				}
				if(userData.login && userData.login.indexOf('@gmail.com') != -1){
					userData.email = userData.login;
				}
				User.create(userData).exec(function (err, user) {
					if(err){
						console.error(err);
                		return deferred.reject('Error.');
					}
                  	if (user) {            	              
                  		emailService.sendActivationMail(user); 
                  		Notifications.create({user: user.id, helloMessage: true})
                  		.exec(function(){});    	
                    	return deferred.resolve({success: true});
      				}else{
      					console.error('No user created');
      					return deferred.reject('Error.');
      				}
      			});
    		});
		});
	});
	return deferred.promise;
}

exports.registerUser = function(user){
	let deferred = Q.defer();
	let createQs = [];
	Q.all(createQs)
	.catch(function(err){
		return deferred.reject(err);
	})
	.then(function(data){
		return deferred.resolve(data);
	});
	return deferred.promise;	
}