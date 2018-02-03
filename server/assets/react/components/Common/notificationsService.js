let _listeners = [];
function addNotificationsListener(cb){
	_listeners.push(cb);
	return _listeners.length - 1;
}

function removeNotificationsListener(key){
	_listeners[key] = null;
}

function updateNewHintsCount(newCount){
	for(var i = 0; i < _listeners.length; i++){
		try{
			if(_listeners[i]){
				_listeners[i]({hints: newCount});
			}
		}
		catch(ex){
			console.error(ex);
		}
	}
}

function loadNewHintsCount(){
    return new Promise((resolve, reject) => {
        let url = '/api/notifications/hints';
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

export { loadNewHintsCount, updateNewHintsCount, addNotificationsListener, removeNotificationsListener };