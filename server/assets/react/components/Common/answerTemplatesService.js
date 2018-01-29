function loadAnswers(){
	return new Promise((resolve, reject) => {
		let url = '/api/AnswerTemplate/';
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

function saveAnswer(id, text){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/AnswerTemplate/'+id,
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

function removeAnswer(id){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/AnswerTemplate/'+id,
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

function addAnswer(name){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/AnswerTemplate/',
            type: 'POST',
            data:{name: name, text:'.'},
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

export {loadAnswers, saveAnswer, removeAnswer, addAnswer};