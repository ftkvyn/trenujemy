function loadDishes(dayId){
	return new Promise((resolve, reject) => {
		$.get(`/api/dishes/${dayId}`)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function saveDish(dish){
	return new Promise((resolve, reject) => {
		$.post(`/api/dishes/${dish.dailyReport}`, dish)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function addComponent(dayId, model){
	return new Promise((resolve, reject) => {
		$.post(`/api/dish/addComponent/${dayId}`, model)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function removeComponent(dayId, model){
	return new Promise((resolve, reject) => {
		$.post(`/api/dish/removeComponent/${dayId}`, model)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

export{loadDishes, addComponent, removeComponent, saveDish}