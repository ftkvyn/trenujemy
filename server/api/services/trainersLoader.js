const Q = require('q');

exports.loadTrainersPage = function(where, options) {
	var deferred = Q.defer();

	if(!Number(options.pageSize)){
		options.pageSize = 10;
	}
	if(!Number(options.page)){
		options.page = 1;
	}
	options.skip = options.pageSize * (options.page - 1);

	var qs = [];
	qs.push(TrainerInfo.find({limit: options.pageSize, skip: options.skip, where:where})
		.sort('createdAt DESC')
		.populate('user'));
	qs.push(TrainerInfo.count({where:where}))
	Q.all(qs)
	.then(function(data){
		var totalPages = Math.ceil(data[1] / options.pageSize);
		deferred.resolve({ trainers: data[0], totalPages: totalPages });
	})
	.catch(function (err) {
        deferred.reject(new Error(err));
    })
    .done();	
    return deferred.promise;		
}