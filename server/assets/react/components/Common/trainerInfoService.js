function loadTrainerInfo(){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/trainerInfo/',
            type: 'GET',
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

function loadTrainPlans() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/trainPlan/',
            type: 'GET',
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

function loadFeedPlans() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/feedPlan/',
            type: 'GET',
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


function adminActivate(model){
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/trainerInfo/adminApprovement/'+model.id,
            type: 'POST',
            data: model,
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

function saveTrainerInfo(model){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/trainerInfo/'+model.id,
            type: 'PATCH',
            data: model,
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

function saveTrainerRoute(model){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/trainerInfo/route/'+model.id,
            type: 'POST',
            data: model,
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

export{ saveTrainerInfo, saveTrainerRoute, loadTrainerInfo, adminActivate, loadTrainPlans, loadFeedPlans }