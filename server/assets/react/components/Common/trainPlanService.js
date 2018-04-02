function loadActivePlans(){
	return new Promise((resolve, reject) => {
		$.get('/api/trainPlan')
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function loadAllPlans(){
	return new Promise((resolve, reject) => {
		$.get('/api/trainPlansAll')
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function savePlan(plan){
	if( plan.priceOld == null){
		delete plan.priceOld;
	}
	if(plan.price == null){
		delete plan.price;
	}
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/trainPlan/'+plan.id,
            type: 'PATCH',
            data: plan,
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


export {loadAllPlans, loadActivePlans, savePlan};