let userData = {};
let resolveWaiters = [];
let rejectWaiters = [];


$.get('/api/userData')
.success(function(data) {
	userData = data;
	console.log('service');
	console.log(data);
	for (var i = resolveWaiters.length - 1; i >= 0; i--) {
		try{
			resolveWaiters[i](data);
		}	
		catch(ex){
			console.error(ex);
		}
	}
	resolveWaiters = [];
	rejectWaiters = [];
})
.error(function(err){
	console.error(err);
	for (var i = rejectWaiters.length - 1; i >= 0; i--) {
		try{
			rejectWaiters[i](data);
		}	
		catch(ex){
			console.error(ex);
		}
	}
	resolveWaiters = [];
	rejectWaiters = [];
});

export default () => {
	return new Promise((resolve, reject) => {
		if(userData.login){
			return resolve(userData);
		}
		resolveWaiters.push(resolve);
		rejectWaiters.push(reject);
	  });
}