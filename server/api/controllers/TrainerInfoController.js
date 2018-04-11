//TrainerInfoController

const routeSymbols = '1234567890-_qwertyuiopasdfghjklzxcvbnm'
//fields that cannot be updated in update function
const readonlyFields = ['user', 'friendlyId', 'isApprovedByAdmin', 'id', 'createdAt', 'updatedAt'];

module.exports = {
	find: function(req,res){
		TrainerInfo.findOne({user: req.session.user.id})
		.exec(function(err, info){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.send(info);
		});
	},


	updateRoute:function(req, res){
		let resultRoute = '';
		let hasErrors = false;
		let friendlyId = req.body.friendlyId.toLocaleLowerCase();
		for(let i = 0; i < friendlyId.length; i++){
			if(routeSymbols.indexOf(friendlyId[i]) > -1){
				resultRoute += friendlyId[i];
			}else{
				resultRoute += '_';
			}
		}
		TrainerInfo.find({friendlyId: resultRoute})
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			if(data.length){
				if(data.length == 1 && data[0].id == req.body.id){
					//In use by current trainer - no error
				}else{
					return res.badRequest({inUse: true});
				}
			}
			TrainerInfo.update({id: req.body.id}, {friendlyId: resultRoute})
			.exec(function(err, data){
				if(err){
					console.error(err);
					return res.badRequest(err);
				}	
				let result = {friendlyId: resultRoute, hasErrors: hasErrors};
				return res.send(result);
			});	
		});
	},

	approveByAdmin:function(req, res){

	},

	update:function(req, res){
		try{
			let model = req.body;
			for(let i = 0; i < readonlyFields.length; i++){
				if(model[readonlyFields[i]]){
					delete model[readonlyFields[i]];
				}
			}
			TrainerInfo.update(req.params.id, model)
			.exec(function(err, data){
				try{
					if(err){
						console.error(err);
						return res.badRequest(err);
					}	
					return res.send({success: true});
				}				
				catch(ex){
					console.error(ex);
					return res.badRequest(err);
				}
			});
		}
		catch(ex){
			console.error(ex);
			return res.badRequest(err);
		}
	}
}