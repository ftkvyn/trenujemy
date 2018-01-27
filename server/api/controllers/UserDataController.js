const Q = require('q');

module.exports = {
	getUserData: function(req,res){
		var model = req.session.user;
		if(!model){
			return res.json({});
		}
		let qs = [];

		qs.push(User.findOne({id: model.id}));
		qs.push(FeedPlanPurchase.find({user: model.id, isActive: true}));
		qs.push(TrainPlanPurchase.find({user: model.id, isActive: true}));

		Q.all(qs)
		.catch(function(err){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
		})
		.done(function(data){
			const user = data[0];
			const feedPlans = data[1];
			const trainPlans = data[2];
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
				return res.json({user: user, feedPlans: feedPlans, trainPlans: trainPlans});	
			}else{
				TrainerInfo.findOrCreate({user: user.id}, {user: user.id})
				.exec(function(err, info){
					if(!err && info){
						user.invoiceInfo = info.invoiceInfo;
						return res.json({user: user});	
					}
				});
			}			
		});
	},

	getUserPurchases: function(req, res){
		var userId = req.params.userId || req.session.user.id;

		let qs = [];

		qs.push(FeedPlanPurchase.find({user: model.id}).populate('plan').populate('target'));
		qs.push(TrainPlanPurchase.find({user: model.id}).populate('plan'));

		Q.all(qs)
		.catch(function(err){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
		})
		.done(function(data){
			const feedPlans = data[0];
			const trainPlans = data[1];

			return res.json({feedPlans: feedPlans, trainPlans: trainPlans});		
		});

	},

	saveUserData:function(req, res){
		var model = {
			//profilePic
			name: req.body.name,
			phone: req.body.phone,
			profilePic: req.body.profilePic
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
 
	saveSurvey:function(req, res){
		var model = req.body;
		if(!model.dailyCalories){
			model.dailyCalories = 0;
		}
		if(!model.supplementsCost){
			model.supplementsCost = 0;
		}
		
		BodySize.update({id: model.bodySize.id, user: req.session.user.id}, model.bodySize)
		.exec(function(err, bodySizes){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			model.bodySize = model.bodySize.id;
			UserInfo.update({user: req.session.user.id}, model)
			.exec(function(err, userInfos){
				if(err){
					console.error(err);
					return res.badRequest(err);
				}
				return res.json({success: true});
			});
		});
		
	},

	getSurvey:function(req, res){
		var model = req.body;
		var userId = req.params.userId || req.session.user.id;
		UserInfo
		.findOne({user: userId})
		.populate('bodySize')
		.exec(function(err, userInfo){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			if(userInfo){
				return res.json(userInfo);
			}
			BodySize.create({user: userId})
			.exec(function(err, bodySize){
				if(err){
					console.error(err);
					return res.badRequest(err);
				}
				UserInfo.create({user: userId, bodySize: bodySize})
				.exec(function(err, userInfo){
					if(err){
						console.error(err);
						return res.badRequest(err);
					}
					userInfo.bodySize = bodySize;
					return res.json(userInfo);
				});
			});
		});
	},	

	getSurveyFileLink:function(req, res) {
		UserInfo.findOne({id: req.params.id})
		.exec(function(err, userInfo){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			if(req.session.user.role != 'trainer' && (req.session.user.id != userInfo.user) || !userInfo.medicalReporKey){
				return res.forbidden();
			}
			var url = s3Uploader.getFileUrl(userInfo.medicalReporKey, userInfo.medicalReportName);
			return res.send({url: url});
		});
	}
}