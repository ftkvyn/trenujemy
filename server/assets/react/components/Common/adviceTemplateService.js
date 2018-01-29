function loadAdviceTemplates(){
	return new Promise((resolve, reject) => {
		let url = '/api/AdviseTemplate/';
		$.get(url)
		.success(function(data) {
			resolve(data);
		})
		.error(function(err){
			console.error(err);
			reject(err);
		});
	  });
}

function saveAdviceTemplate(id, text){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/AdviseTemplate/'+id,
            type: 'PUT',
            data: {id: id, text: text},
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

function removeAdviceTemplate(id){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/AdviseTemplate/'+id,
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

function addAdviceTemplate(name){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/AdviseTemplate/',
            type: 'POST',
            data:{name: name},
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

export {loadAdviceTemplates, saveAdviceTemplate, removeAdviceTemplate, addAdviceTemplate};