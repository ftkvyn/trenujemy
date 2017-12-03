let clients = [];
let loaded = false;
let resolveWaiters = [];
let rejectWaiters = [];

function load() {
	$.get('/api/clients')
	.success(function(data) {
		clients = data;
		loaded = true;
		for (var i = resolveWaiters.length - 1; i >= 0; i--) {
			try{
				resolveWaiters[i](data);
			}	
			catch(ex){
				console.error(ex);
			}
		}
		resolveWaiters = [];
		rejectWaiters = [];
	})
	.error(function(err){
		loaded = true;
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
}

function loadClients(){
	load();
	return new Promise((resolve, reject) => {
		if(loaded){
			return resolve(clients);
		}
		resolveWaiters.push(resolve);
		rejectWaiters.push(reject);
	  });
}

export {loadClients};