
function loadTargets(){
	return new Promise((resolve, reject) => {
		$.get('/api/feedPlanTarget')
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}


function saveTarget(newData){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/feedPlanTarget/'+newData.id,
            type: 'PUT',
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


function loadPlans(){
	return new Promise((resolve, reject) => {
		$.get('/api/feedPlan')
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}


function savePlan(newData){
	if( newData.priceOld == null){
		delete newData.priceOld;
	}
	if( newData.price == null){
		delete newData.price;
	}
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/feedPlan/'+newData.id,
            type: 'PUT',
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


export {saveTarget, loadTargets, loadPlans, savePlan};