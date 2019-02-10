//promoCodeGenerator
const Q = require('q');

const symbols = 'qazxswedcvfrtgbnhyujmkp23456789'.toUpperCase();
const codeLength = 6;

function randomizeCode(){
	let code = '';
	for (var i = 0; i < codeLength; i++){
	    code += symbols.charAt(Math.floor(Math.random() * symbols.length));
	}
	return code;
}

function checkIfUnique(code){
	const deferred = Q.defer();
	PromoCode.findOne({value: code})
	.exec(function(item, err){
		if(err){
			console.error(err);
			return deferred.reject({error: err});
		}
		if(item){
			return deferred.reject({isUsed: true});
		}
		return deferred.resolve(code);
	});
	return deferred.promise;
}

function tryGenerateCode(cb){
	const code = randomizeCode();
	checkIfUnique(code)
	.then(function(goodCode) {
		return cb(null, goodCode);
	})
	.catch(function(data) {
		if(data.error){
			return cb(data.error);
		}else if(data.isUsed){
			return tryGenerateCode(cb);
		} else{
			return cb('Unknown error');
		}
	});
}

exports.generateCode = function(argument) {
	const deferred = Q.defer();
	try{
		tryGenerateCode(function(err, code){
			if(err){
				return deferred.reject(err);
			}
			deferred.resolve(code);
		});
	}
	catch(ex){
		deferred.reject(ex);
	}
	return deferred.promise;
}