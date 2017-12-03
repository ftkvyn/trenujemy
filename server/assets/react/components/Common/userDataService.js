let userData = {};
let resolveWaiters = [];
let rejectWaiters = [];


$.get('/api/userData')
.success(function(data) {
	userData = data;
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
			rejectWaiters[i](err);
		}	
		catch(ex){
			console.error(ex);
		}
	}
	resolveWaiters = [];
	rejectWaiters = [];
});

function loadUser(){
	return new Promise((resolve, reject) => {
		if(userData.login){
			return resolve(userData);
		}
		resolveWaiters.push(resolve);
		rejectWaiters.push(reject);
	  });
}

function saveUser(newUser){
	return new Promise((resolve, reject) => {
		$.post('/api/userData', newUser)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function loadSurvey(userId){
	let promise = new Promise((resolve, reject) => {
		let url = '/api/survey';
		if(userId){
			url += '/' + userId;
		}
		$.get(url)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	});
	return promise;
}

function saveSurvey(model){
	let promise = new Promise((resolve, reject) => {
		let url = '/api/survey';
		$.post(url, model)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	});
	return promise;
}

export {loadUser, saveUser, loadSurvey, saveSurvey};