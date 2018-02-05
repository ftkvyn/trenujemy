let notifyData = {};
let resolveWaiters = [];
let rejectWaiters = [];

$.get('/api/notifications')
.success(function(data) {
	notifyData = data;
	for (var i = resolveWaiters.length - 1; i >= 0; i--) {
		try{
			let model = Object.assign({}, data);
			resolveWaiters[i](model);
		}	
		catch(ex){
			console.error(ex);
		}
	}
	resolveWaiters = [];
	rejectWaiters = [];
})
.error(function(err){
	console.error(err);
	for (var i = rejectWaiters.length - 1; i >= 0; i--) {
		try{
			rejectWaiters[i](err);
		}	
		catch(ex){
			console.error(ex);
		}
	}
	resolveWaiters = [];
	rejectWaiters = [];
});

function loadNotifications(){
	return new Promise((resolve, reject) => {
		if(notifyData.id){
			let model = Object.assign({}, notifyData);
			return resolve(model);
		}
		resolveWaiters.push(resolve);
		rejectWaiters.push(reject);
	  });
}

let _listeners = [];
function addNotificationsListener(cb){
	_listeners.push(cb);
	return _listeners.length - 1;
}

function removeNotificationsListener(key){
	_listeners[key] = null;
}

function updateNotifications(data){
	for(var i = 0; i < _listeners.length; i++){
		try{
			if(_listeners[i]){
				_listeners[i](data);
			}
		}
		catch(ex){
			console.error(ex);
		}
	}
}

function saveNotifications(newData){
	return new Promise((resolve, reject) => {
		$.ajax({
            url: '/api/notifications/' + newData.id,
            type: 'PUT',
            data: newData,
            success: function (data) {
            	notifyData = data;
            	resolve(data);                
            },
            error: function(err){
                console.error(err);
                reject(err);                
            }
        });
	  });
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

export { loadNewHintsCount, updateNotifications, saveNotifications, addNotificationsListener, removeNotificationsListener, loadNotifications };