function loadUserAdvice(userId){
	return new Promise((resolve, reject) => {
		let url = '/api/advice';
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

function loadDefaultAdvice(){
	return new Promise((resolve, reject) => {
		let url = '/api/defaultAdvice';
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

function saveAdvice(data){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/advice/'+data.id,
            type: 'PUT',
            data: data,
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