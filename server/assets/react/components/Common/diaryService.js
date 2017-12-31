let daysDictionary = {};


function loadDay(dateStr, userId){
	return new Promise((resolve, reject) => {
		$.get(`/api/diary/${dateStr}/${userId || ''}`)
		.success(function(data) {
			daysDictionary[dateStr] = data;
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function getDayByStr(dateStr){
	return daysDictionary[dateStr];
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

function saveTraining(training){
	return new Promise((resolve, reject) => {
		$.post(`/api/dailyTraining/${training.dailyReport}`, training)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function saveBodySize(newData){
	return new Promise((resolve, reject) => {
		$.post(`/api/dailyBodySize`, newData)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function getPastImages(date, userId){
	return new Promise((resolve, reject) => {
		$.get(`/api/pastBodyImages/${date}/${userId || ''}`)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function getDayTypes(dates, userId){
	return new Promise((resolve, reject) => {
		$.post(`/api/dayTypes/${userId || ''}`, {days: dates})
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

export {loadDay, saveDay, saveTraining, saveBodySize, getPastImages, getDayTypes, getDayByStr}