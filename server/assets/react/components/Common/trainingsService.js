//trainingsService

function loadUserTrainings(userId){
	return new Promise((resolve, reject) => {
		let url = '/api/training/';
		if(userId){
			url += userId;
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
}

function createUserTrainings(model){
	return new Promise((resolve, reject) => {
		let url = '/api/training/';
		$.post(url, model)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function saveComment(trainingId, comment){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/training/'+data.id,
            type: 'PUT',
            data: {comment: comment},
            success: function (data) {
            	resolve(data);                
            },
            error: function(err){
                console.error(err);
                reject(err);                
            }
        });
	  });
}


export {loadUserAdvice, loadDefaultAdvice, saveAdvice};