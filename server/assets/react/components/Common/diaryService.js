
function loadDay(dateStr, userId){
	return new Promise((resolve, reject) => {
		$.get(`/api/diary/${dateStr}/${userId || ''}`)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}


function saveDay(newData){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: `/api/diary/${newData.id}/${newData.user}`,
            type: 'POST',
            data: newData,
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

function saveTraining(training, dayId){
	return new Promise((resolve, reject) => {
		$.post(`/api/dailyTraining/${dayId}`, training)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

export {loadDay, saveDay, saveTraining}