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

function loadUser(userId){
	if(!userId){
		return new Promise((resolve, reject) => {
			if(userData.user){
				return resolve(userData);
			}
			resolveWaiters.push(resolve);
			rejectWaiters.push(reject);
		  });
	}else{
		let promise = new Promise((resolve, reject) => {
			let url = '/api/userData/'+ userId;			
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

function loadPurchases(userId){
	let promise = new Promise((resolve, reject) => {
		let url = '/api/userPurchases';
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

// function loadRequirements(userId) {
// 	let promise = new Promise((resolve, reject) => {
// 		let url = '/api/userRequirement';
// 		if(userId){
// 			url += '/' + userId;
// 		}
// 		$.get(url)
// 		.success(function(data) {
// 			resolve(data);
// 		})
// 		.error(function(err){
// 			console.error(err);
// 			reject(err);
// 		});
// 	});
// 	return promise;
// }

// function saveRequirements(model){
// 	let promise = new Promise((resolve, reject) => {
// 		$.ajax({
//             url: '/api/userRequirement/'+model.id,
//             type: 'PUT',
//             data: model,
//             success: function (data) {
//             	resolve(data);                
//             },
//             error: function(err){
//                 console.error(err);
//                 reject(err);                
//             }
//         });
// 	});
// 	return promise;
// }

function updateEmail(userEmail){
	let promise = new Promise((resolve, reject) => {
		let url = '/api/userEmail';
		$.post(url, {email : userEmail})
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

export {loadUser, saveUser, loadSurvey, saveSurvey, loadRequirements, saveRequirements, loadPurchases, updateEmail};