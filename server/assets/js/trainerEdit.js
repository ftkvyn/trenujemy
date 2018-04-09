'use strict'

$(function() {
	const hintText = 'Możesz zmienić tą wartość w ustawieniach konta.';
	$('[data-hint]').attr('title', hintText);
	$('[data-hint]').click(function(){
		alert(hintText);
	});

	var mainText = $('[data-main-text]');
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
			    //ToDo: save value
			    mainText.text(value);
			    mainText.show();
			    editor.remove();
			}
		});
	});

	//ToDo: handle adding and removing items.
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
				    //ToDo: save value
				    if(value){
					    liItem.text(value);
					    liItem.show();
					}else{
						liItem.remove();
					}
				    editor.remove();
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
			liItem.removeAttr('data-field');
			let checkBox = $(`<li><input type="checkbox" id="${name}" /><label for="${name}">${liItem.text()}</label></li>`);
			liItem.after(checkBox);
			liItem.remove();
			checkBox.find('input').on('change', function(event){
				//ToDo: save value
				console.log('save(' + this.id + '): ' + this.checked);				
			});
		});
	});

	let freeSampleBlock = $('.free-sample-block');
	let freeSapleCheck = $('<div class="free-sample-edit clearfix"><input checked="checked" type="checkbox" id="free-sample-on" /><label for="free-sample-on">Włącz darmową konsultację</label></div>');
	freeSapleCheck.find('input').on('change', function(event){
		//ToDo: save value
		console.log('save(isFreeSample): ' + this.checked);				
		if(!this.checked){
			freeSampleBlock.hide();
		}else{
			freeSampleBlock.show();
		}
	});
	freeSampleBlock.before(freeSapleCheck);


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
				    let priceId = priceEl.closest('[name=trainingPlan]').val();
				    console.log(`save(trainId=${priceId};price${priceAttr}): ${value}`);
				    //ToDo: save value
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
				    let priceId = countEl.closest('[name=trainingPlan]').val();
				    console.log(`save(trainId=${priceId};trainCount): ${value}`);
				    //ToDo: save value
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
				    priceEl.text(value);
				    priceEl.show();
				    editorInput.remove();
				}
			});
		});
	});
})