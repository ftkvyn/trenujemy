/**
 * AdviceController
 *
 * @description :: Server-side logic for managing Advicecontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const defaultVals = {
	fiber: 25,
  	sodium: 2400,
  	potassium: 2000,
  	calcium:800,
  	iron:14,
  	vitaminC:80,
  	vitminA:800
}

module.exports = {
	getDefaultVals:function(req, res){
		res.json(defaultVals);
	},

	findUserTrainers: function(req, res){
		Advice
		.find({user: req.session.user.id})
		.populate('trainer')
		.exec(function(err, advices){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			let trainers = advices.map(item => {return {name: item.trainer.name, id: item.trainer.id}});
			return res.json(trainers);
		});
	},

	find:function(req, res){
		var model = req.body;
		var userId = req.params.userId;

		if(req.session.user.role == 'user'){
			Advice
			.findOne({user: req.session.user.id, trainer: userId})
			.exec(function(err, advice){
				if(err){
					console.error(err);
					return res.badRequest(err);
				}
				return res.json(advice);
			});
		}else if(req.session.user.role == 'trainer'){
			Advice
			.findOne({user: userId, trainer:req.session.user.id})
			.exec(function(err, advice){
				if(err){
					console.error(err);
					return res.badRequest(err);
				}
				if(advice){
					return res.json(advice);
				}

				Advice.create({user: userId, trainer:req.session.user.id})
				.exec(function(err, advice){
					if(err){
						console.error(err);
						return res.badRequest(err);
					}
					return res.json(advice);
				});
			});
		}else{
			return res.forbidden();
		}
	},

	update:function(req, res){
		let model = req.body;
		if(req.session.user.role == 'trainer'){
			model.shouldSendEmail = true;
		}
		Advice.update({id: req.params.id}, model)
		.fetch()
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			let userId = data[0].user;
			if(req.session.user.role == 'trainer'){
				Notifications.findOne({user: userId})
				.exec(function(err, notification){
					if(err){
						console.error(err);
						return;
					}
					if(!notification.advices){
						notification.advices = [];
					}
					notification.advices.push(req.session.user.id);
					Notifications.update({id: notification.id}, {advices: notification.advices})
					.exec(function(){});
				});
			}
			return res.json(data);
		});
	},	
};

