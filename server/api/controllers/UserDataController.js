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
	},

	getClientsData: function(req, res){
		User.find({role:'user', isActive: true})
		.exec(function(err, users){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			var models = users.map(function(user){
				var model = user;
				delete user.password;
				delete user.activationCode;
				delete user.passwordRecoveryKey;
				return model; 
			});	
			return res.json(models);
		});
	},

	uploadImage: function(req, res){
		req.file('file').upload({
			dirname: sails.config.appPath + '/.tmp/upload/',
			maxBytes: 10000000
		},function (err, uploadedFiles){
			if(err){
				console.log(err);
				return res.badRequest(err);
			}
			if(uploadedFiles.length){
				var model = {};
				model.fileData = uploadedFiles[0].fd;
				model.originalName = uploadedFiles[0].filename;
				model.name = 'andrei_profile_img';
				model.type = uploadedFiles[0].type;
				s3Uploader.uploadFile(model)
				.then(function(data){
					var url = s3Uploader.getFileUrl(data.key);
					return res.redirect('/dashboard/profile');
				})
				.catch(function(err){
					return res.badRequest(err);
    			})
    			.done();;
			}else{
				return res.redirect('/dashboard/profile');
			}
		});

	}
}