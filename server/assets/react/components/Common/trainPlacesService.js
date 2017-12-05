function loadPlaces(){
	return new Promise((resolve, reject) => {
		$.get('/api/trainPlaces')
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function savePlace(newPlace){
	return new Promise((resolve, reject) => {
		$.post('/api/trainPlaces', newPlace)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function deletePlace(placeId){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/trainPlaces/'+placeId,
            type: 'DELETE',
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


export {loadPlaces, savePlace, deletePlace};