//surveySettngsService


function loadSurveySettngs(){
	return new Promise((resolve, reject) => {
		$.get('/api/SurveySettngs')
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}


function saveSurveySettng(newData){
	if( newData.priceOld == null){
		delete newData.priceOld;
	}
	if( newData.price == null){
		delete newData.price;
	}
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/SurveySettngs/'+newData.id,
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


export { loadSurveySettngs, saveSurveySettng };