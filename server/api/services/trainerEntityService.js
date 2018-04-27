//trainerEntityService.js
const Q = require('q');

exports.checkTrainer = function(Model, id, trainerId){
	let deferred = Q.defer();
	Model.findOne({id: id, trainer: trainerId})
	.exec(function(err, data){
		if(err){
			return deferred.reject(err);
		}
		if(!data){
			return deferred.reject('Entity not found');
		}
		return deferred.resolve(data);
	});
	return deferred.promise;
}