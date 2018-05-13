//TrainerInfoController

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
		friendlyIdService.findFriendlyId(TrainerInfo, req.body.friendlyId, req.body.id, function(err, resultRoute){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}	
			TrainerInfo.update({id: req.body.id}, {friendlyId: resultRoute})
			.exec(function(err, data){
				if(err){
					console.error(err);
					return res.badRequest(err);
				}	
				let result = {friendlyId: resultRoute};
				return res.send(result);
			});	
		});		
	},

	approveByAdmin:function(req, res){
		let model = {};
		model.isApprovedByAdmin = req.body.isApprovedByAdmin;
		if(model.isApprovedByAdmin){
			model.activatedAt = new Date();
		}
		TrainerInfo.update(req.params.id, model)
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}	
			return res.send('ok');
		});	
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