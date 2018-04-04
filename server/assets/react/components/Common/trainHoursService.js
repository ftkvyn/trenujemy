function loadHours(){
	return new Promise((resolve, reject) => {
		$.get('/api/trainTimes')
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function saveHour(newHour){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/trainTimes/'+newHour.id,
            type: 'PATCH',
            data: newHour,
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


export {loadHours, saveHour};