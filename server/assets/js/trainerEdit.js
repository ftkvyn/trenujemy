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
				    newItemEditor.before(newLiItem);
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
			let name = listName + '_' + num + '_' + liNum;
			let checkBox = $(`<li><input type="checkbox" id="${name}" /><label for="${name}">${liItem.text()}</label></li>`);
			liItem.after(checkBox);
			liItem.remove();
			checkBox.find('input').on('change', function(event){
				//ToDo: save value
				console.log('save(' + listName + '): ' + this.checked);				
			});
		});
	});
})