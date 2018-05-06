'use strict'

function saveTrainerInfo(model){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/trainerInfo/' + model.id,
            type: 'PATCH',
            data: model,
            success: function (data) {
            	resolve(data);                
            },
            error: function(err){
                console.error(err);
                reject(err);      
                alert('Błąd przy zapisywaniu danych.');
            }
        });
	});
}

function saveTrainPlan(model){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/trainPlan/' + model.id,
            type: 'PATCH',
            data: model,
            success: function (data) {
            	resolve(data);                
            },
            error: function(err){
                console.error(err);
                reject(err);      
                alert('Błąd przy zapisywaniu danych.');
            }
        });
	});
}

function addImage(url, parent){
	let imageTag = $(`<div class="cbp-item cbp-item-small">
                            <a href="${url}" class="cbp-caption cbp-lightbox" rel="nofollow">
                                <div class="">
                                    <img src="${url}" alt="">
                                </div>
                            </a>
                        </div>`);
	parent.cubeportfolio('destroy', function(){
		parent.append(imageTag);
		if(parent.hasClass('certificates-gallery')){
			saveCertificates();
			initCertificates();
		}
		if(parent.hasClass('photos-gallery')){
			savePhotos();
			initPhotos();
		}	
	});	
}

function removeImage(){
	let parent = $(this).closest('.cbp');
	let imgContainer = $(this).closest('.cbp-item');

	parent.cubeportfolio('destroy', function(){
		imgContainer.remove();
		if(parent.hasClass('certificates-gallery')){
			saveCertificates();
			initCertificates();
		}	
		if(parent.hasClass('photos-gallery')){
			savePhotos();
			initPhotos();
		}	
	});	
}

function saveCertificates(){
	let certificates = [];
	$('.certificates-gallery').find('img').each(function(num, item){
		certificates.push($(item).attr('src'));
	});
	let model = {id: $('#info-id').val()};
	model.certificateImages = certificates;
	saveTrainerInfo(model);
}

function savePhotos(){
	let photos = [];
	$('.photos-gallery').find('img').each(function(num,item){
		photos.push($(item).attr('src'));
	});
	let model = {id: $('#info-id').val()};
	model.photos = photos;
	saveTrainerInfo(model);
}

function saveFeedPlan(model){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/feedPlan/' + model.id,
            type: 'PATCH',
            data: model,
            success: function (data) {
            	resolve(data);                
            },
            error: function(err){
                console.error(err);
                reject(err);      
                alert('Błąd przy zapisywaniu danych.');
            }
        });
	});
}

function saveList(ulItem, listName, infoId){
	if(!ulItem.is('[data-train-features-list]')){
		let items = [];
	    ulItem.find('li').each(function(){
	    	let text = $(this).text().trim();
	    	if(text){
		    	items.push(text);
		    }
	    });
	    console.log(items);

	    let model = {id: infoId};
	    model[listName] = items;
		saveTrainerInfo(model);
	}else{
		let description = '';
		ulItem.find('li').not('[data-omit-edit]').each(function(){
	    	let text = $(this).text().trim();
	    	if(text){
		    	description += text + '\n';
		    }
	    });
	    console.log(description);
	    let trainPlanId = ulItem.closest('form').find('input[name=trainingPlan]').val();
	    let model = {id: trainPlanId};
	    model.description = description;
		saveTrainPlan(model);
	}
}

$(function() {
	const infoId = $('#info-id').val();

	$("form").submit(function(e){
        e.preventDefault();
    });

    $("a").click(function(e){
        e.preventDefault();
    });

	const hintText = 'Możesz zmienić tą wartość w ustawieniach konta.';
	$('[data-hint]').attr('title', hintText);
	$('[data-hint]').click(function(){
		alert(hintText);
	});

	let mainText = $('[data-main-text]');
	mainText.css('cursor','pointer');	
	mainText.on('click', function(){		
		let editor = $('<textarea></textarea>');
		editor.val(mainText.text());
		editor.css('width','100%');
		editor.addClass(mainText.attr('class'));
		mainText.hide();
		mainText.after(editor);
		editor.on('keyup', function(event){
			if ( event.which == 13 && !event.ctrlKey && !event.shiftKey) {
			    event.preventDefault();
			    let value = editor.val();
			    console.log('save: ' + value);
			    let model = {id: infoId, mainText: value};
			    saveTrainerInfo(model);
			    mainText.text(value);
			    mainText.show();
			    editor.remove();
			}
		});
	});

	$('.add-image').click(function(){
		$(this).siblings('form').find('input').click();
	});

	$('body').on('click','.remove-cbp', removeImage);

	$('.image-input').change(function(){
		let imageInput = $(this);
		let gallery = imageInput.parent().siblings('.cbp');
		var formData = new FormData();
        var fileData = imageInput[0].files[0];
        formData.append('file', fileData);

        $.ajax({
            url: '/api/uploadImage',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            enctype: 'multipart/form-data',
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', function(e) {
                    } , false);
                }
                return myXhr;
            },
            success: function (data) {
            	addImage(data.url, gallery);  
            	//ToDo: save list.            
            },
            error: function(err){
                console.error(err);        
            }
        });
	});

	$('[data-edit-list]').each(function(num){
		let ulItem = $(this);
		let listName = ulItem.attr('data-edit-list');
		ulItem.on('click','li',function(){
			let liItem = $(this);
			if(liItem.find('input').length){
				return;
			}
			var omitAttr = liItem.attr('data-omit-edit');
			if(typeof omitAttr !== typeof undefined && omitAttr !== false){
				return;
			}
			let editor = $('<li><input class="form-control" type="text"/></li>');
			let editorInput = editor.find('input');
			editorInput.val(liItem.text());
			editorInput.css('display','inline');
			liItem.hide();
			liItem.after(editor);
			editorInput.on('keyup', function(event){
				if ( event.which == 13 && !event.ctrlKey && !event.shiftKey) {
				    event.preventDefault();
				    let value = editorInput.val();
				    console.log('save(' + listName + '): ' + value);
				    if(value){
					    liItem.text(value);
					    liItem.show();
					}else{
						liItem.remove();
					}
				    editor.remove();

				    saveList(ulItem, listName, infoId);
				}
			});
		});

		let newItem = $('<li><input class="form-control" type="text"/></li>');
		let newItemEditor = newItem.find('input');
		newItemEditor.css('display','inline');
		newItemEditor.on('keyup', function(event){
			if ( event.which == 13 && !event.ctrlKey && !event.shiftKey) {
			    event.preventDefault();
			    let value = newItemEditor.val();
			    console.log('save(' + listName + '): ' + value);
			    //ToDo: save value
			    if(value){
				    let newLiItem = $(`<li>${value}</li>`);
				    newItem.before(newLiItem);
				    newItemEditor.val('');
				}
				saveList(ulItem, listName, infoId);
			}
		});
		ulItem.append(newItem);
	});

	$('[data-check-list]').each(function(num){
		let ulItem = $(this);
		let listName = ulItem.attr('data-check-list');
		ulItem.find('li').each(function(liNum){
			let liItem = $(this);
			let name = liItem.attr('data-field');
			let isChecked = !!liItem.attr('data-checked');
			liItem.removeAttr('data-field');
			let checkBox = $(`<li><input type="checkbox" id="${name}" /><label for="${name}">${liItem.text()}</label></li>`);
			if(isChecked){
				checkBox.find('input').attr('checked', 'checked');
			}
			liItem.after(checkBox);
			liItem.remove();
			checkBox.find('input').on('change', function(event){
				console.log('save(' + this.id + '): ' + this.checked);	
				let model = {id: infoId};
				model[name] = this.checked;
			    saveTrainerInfo(model);			
			});
		});
	});

	let freeSampleBlock = $('.free-sample-block');
	let freeSapleCheck = $('<div class="free-sample-edit clearfix"><input type="checkbox" id="free-sample-on" /><label for="free-sample-on">Chcę udostępnić możliwość pierwszej konsultacji gratis</label></div>');
	if(freeSampleBlock.is(':visible')){
		freeSapleCheck.find('input').attr('checked', 'checked');
	}
	freeSapleCheck.find('input').on('change', function(event){
		console.log('save(isFreeSample): ' + this.checked);				
		if(!this.checked){
			freeSampleBlock.hide();
		}else{
			freeSampleBlock.show();
		}
		let model = {id: infoId};
		model.isFreeTrainingEnabled = this.checked;
	    saveTrainerInfo(model);		
	});
	freeSampleBlock.before(freeSapleCheck);

	let cityNum = $('#city-num').val();
	$('[data-city-edit]').val(cityNum);

	$('[data-city-edit]').change(function(){
		let value = $(this).val();
		let model = {id: infoId, city: value};
		saveTrainerInfo(model);
	});

	$('[data-price-title]').each(function(num){
		let titleItem = $(this);
		titleItem.click(function(){
			
			if(titleItem.find('input').length){
				return;
			}
			let spanItem = titleItem.find('span');
			let editorInput = $('<input class="form-control" type="text"/>');
			editorInput.val(spanItem.text());
			editorInput.css('display','inline');
			spanItem.hide();
			spanItem.after(editorInput);
			editorInput.on('keyup', function(event){
				if ( event.which == 13 && !event.ctrlKey && !event.shiftKey) {
				    event.preventDefault();
				    let value = editorInput.val();
				    let priceId = titleItem.closest('form').find('[name=trainingPlan]').val();
				    console.log(`save(trainId=${priceId};name): ${value}`);
				    if(value){
					    spanItem.text(value);
					}else{
						spanItem.text("Nazwa");
					}
					spanItem.show();
				    editorInput.remove();

				    let model = {id: priceId, name: value};
				    saveTrainPlan(model);
				}
			});
		});
	})

	$('[data-train-price-edit]').each(function(num){
		let priceEl = $(this);
		let priceAttr = priceEl.attr('data-train-price-edit');
		priceEl.css('cursor','pointer');
		priceEl.click(function(){
			priceEl.closest('.old-price').css('opacity','1');
			let editorInput = $('<input class="form-control" type="number"/>');
			editorInput.val(priceEl.text());
			editorInput.css('display','inline');
			editorInput.css('width','70px');
			priceEl.hide();
			priceEl.after(editorInput);
			editorInput.on('keyup', function(event){
				if ( event.which == 13 && !event.ctrlKey && !event.shiftKey) {
				    event.preventDefault();
				    let value = editorInput.val() || '0';				    
				    let priceId = priceEl.closest('form').find('[name=trainingPlan]').val();
				    console.log(`save(trainId=${priceId};price${priceAttr}): ${value}`);
				    let model = {id: priceId};
				    model[`price${priceAttr}`] = value;
				    saveTrainPlan(model);
				    priceEl.text(value);
				    priceEl.show();
				    if(!+value && priceAttr=='Old'){
					    priceEl.closest('.old-price').css('opacity','0.3');
					}else{
						priceEl.closest('.old-price').css('opacity','1');
					}
				    editorInput.remove();
				}
			});
		});
	});

	$('[data-train-count-edit]').each(function(num){
		let countEl = $(this);
		countEl.css('cursor','pointer');
		countEl.click(function(){
			let editorInput = $('<input class="" type="number"/>');
			editorInput.val(countEl.text());
			editorInput.css('display','inline');
			editorInput.css('width','60px');
			countEl.hide();
			countEl.after(editorInput);
			editorInput.on('keyup', function(event){
				if ( event.which == 13 && !event.ctrlKey && !event.shiftKey) {
				    event.preventDefault();
				    let value = editorInput.val();
				    if(!value){
				    	return;
				    }
				    let priceId = countEl.closest('form').find('[name=trainingPlan]').val();
				    console.log(`save(trainId=${priceId};trainsCount): ${value}`);
				    let model = {id: priceId};
				    model.trainsCount = value;
				    saveTrainPlan(model);
				    countEl.text(value);
				    countEl.show();
				    editorInput.remove();
				}
			});
		});
	});


	$('[data-feed-price-edit]').each(function(num){
		let priceEl = $(this);
		priceEl.css('cursor','pointer');
		priceEl.click(function(){
			let editorInput = $('<input class="form-control" type="number"/>');
			editorInput.val(priceEl.text());
			editorInput.css('display','inline');
			editorInput.css('width','100px');
			priceEl.hide();
			priceEl.after(editorInput);
			editorInput.on('keyup', function(event){
				if ( event.which == 13 && !event.ctrlKey && !event.shiftKey) {
				    event.preventDefault();
				    let value = editorInput.val() || '0';				    
				    let priceId = priceEl.closest('.feed-item').find('[name=feedPlan]').val();
				    console.log(`save(feedId=${priceId};price): ${value}`);
				    //ToDo: save value
				    let model = {id: priceId, price: value};
				    saveFeedPlan(model);
				    priceEl.text(value);
				    priceEl.show();
				    editorInput.remove();
				}
			});
		});
	});
})