function loadCodes(){
	return new Promise((resolve, reject) => {
		$.get(`/api/promoCode/`)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}


function generateCode(model){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: `/api/promoCode/`,
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

export{ loadCodes, generateCode }