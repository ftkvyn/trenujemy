

function save(formData, url){
	let promise = new Promise((resolve, reject) => {
		$.ajax({
            // Your server script to process the upload
            url: url,
            type: 'POST',

            // Form data
            data: formData,

            // Tell jQuery not to process data or worry about content-type
            // You *must* include these options!
            cache: false,
            contentType: false,
            processData: false,
            enctype: 'multipart/form-data',

            // Custom XMLHttpRequest
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    // For handling the progress of the upload
                    myXhr.upload.addEventListener('progress', function(e) {
                        
                    } , false);
                }
                return myXhr;
            },
            success: function (data) {
            	resolve(data);                
            },
            error: function(err){
                console.error(err);
                reject(err);                
            }
        });
	});
	return promise;
}

function saveFile(formData){
	return save(formData, '/api/uploadFile');
}

function saveImage(formData){
	return save(formData, '/api/uploadImage');	
}

function getFileLink(surveyId) {
    let promise = new Promise((resolve, reject) => {
        let url = '/api/surveyFileLink/'+surveyId;
        $.get(url)
        .success(function(data) {
            resolve(data);
        })
        .error(function(err){
            console.error(err);
            reject(err);
        });
    });
    return promise;
}

export {saveFile, saveImage, getFileLink};