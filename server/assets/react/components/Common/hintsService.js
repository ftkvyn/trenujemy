function loadUserHints(userId){
    return new Promise((resolve, reject) => {
        let url = `/api/hints/${userId || ''}`;
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

function loadHints(){
	return new Promise((resolve, reject) => {
		let url = '/api/TrainerHints/';
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

function saveHint(id, text){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/TrainerHints/'+id,
            type: 'PATCH',
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

function removeHint(id){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/TrainerHints/'+id,
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

function addHint(name){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/TrainerHints/',
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

function loadSendHints(){
    return new Promise((resolve, reject) => {
        let url = '/api/sendTrainerHints/';
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

function saveSendHints(value){
    return new Promise((resolve, reject) => {
        let url = '/api/sendTrainerHints/';
        $.post(url, {value: value})
        .success(function(data) {
            resolve(data);
        })
        .error(function(err){
            console.error(err);
            reject(err);
        });
      });
}

export {loadHints, saveHint, removeHint, addHint, loadSendHints, saveSendHints, loadUserHints};