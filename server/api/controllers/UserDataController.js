module.exports = {
	getUserData: function(req,res){
		var model = req.session.user;
		if(!model){
			return res.json({});
		}
		User.findOne({id: model.id})
		.exec(function(err, user){
			if(err){
				console.error(err);
				return res.error(err);
			}
			delete user.password;
			delete user.activationCode;
			delete user.passwordRecoveryKey;
			try{
				if(user.birthday.startsWith('0000-00-00')){
					delete user.birthday;
				}
			}
			catch(ex){
				//Do nothing.
			}

			if(user.role != 'trainer'){
				return res.json(user);	
			}else{
				TrainerInfo.findOrCreate({user: user.id}, {user: user.id})
				.exec(function(err, info){
					if(!err && info){
						user.invoiceInfo = info.invoiceInfo;
						return res.json(user);	
					}
				});
			}			
		});
	},

	saveUserData:function(req, res){
		var model = {
			//profilePic
			name: req.body.name,
			phone: req.body.phone
		};
		if(req.body.birthday){
			model.birthday = req.body.birthday;
		}
		User.update({id: req.body.id}, model)
		.exec(function(err, users){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			if(users[0].role == 'trainer'){
				TrainerInfo.update({user: users[0].id}, {invoiceInfo: req.body.invoiceInfo})
				.exec(function(err, data){
					if(err){
						console.error(err);
						return res.badRequest(err);
					}		
					return res.json({success: true});
				});
			}else{
				return res.json({success: true});
			}
		});
	}
}