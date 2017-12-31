let allComponents = [];
let loaded = false;
let resolveWaiters = [];
let rejectWaiters = [];

function __loadComponents() {
	$.get('/api/dishComponents')
	.success(function(data) {
		allComponents = data;
		loaded = true;
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
		loaded = true;
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
}

function loadComponents(){
	__loadComponents();
	return new Promise((resolve, reject) => {
		if(loaded){
			return resolve(allComponents);
		}
		resolveWaiters.push(resolve);
		rejectWaiters.push(reject);
	  });
}

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

export{loadDishes, addComponent, removeComponent, saveDish, loadComponents}