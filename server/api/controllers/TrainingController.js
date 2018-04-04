/**
 * TrainingController
 *
 * @description :: Server-side logic for managing Trainings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const Q = require('q');

module.exports = {
	find:function(req, res){
		var userId = req.params.userId || req.session.user.id;
		//ToDo: load training purchases.
		Training
		.find({user: userId})
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.json(data);
		});
	},	

	update:function(req, res){
		let model = {};
		if(req.session.user.role == 'trainer'){
			model.trainerComment = req.body.comment;
		}else{
			model.userComment = req.body.comment;
			model.user = req.session.user.id;
		}
		Training.update({id: req.params.id}, model)
		.fetch()
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.json(data);
		});
	},

	create:function(req, res){
		let model = {};
		model.user = req.body.user;
		model.place = req.body.place;
		model.date = new Date(req.body.date);
		TrainPlanPurchase.find({user: model.user, isActive: true})
		.exec(function(err, data){
			if(err || !data || !data.length){
				console.error(err);
				return res.badRequest(err);
			}

			var plan = data[0];
			model.purchase = plan.id;

			let qs = [];

			qs.push(TrainPlanPurchase.update({id: plan.id},{trainsLeft: plan.trainsLeft - 1}));
			qs.push(Training.create(model).fetch());

			Q.all(qs)
			.catch(function(err){
				if(err){
					console.error(err);
					return res.badRequest(err);
				}
			})
			.then(function(data){
				let training = data[1];
				res.json(training);

				User.findOne({id: model.user})
				.exec(function(err, user){
					if(err){
						console.error(err);
					}
					if(user.email && user.email.indexOf('@gmail.com') != -1){
						googleCalendarService.addEvent(training, user.login)
						.catch(function(err){
							console.error(err);
						})
						.then(function(evt){
							Training.update({id: training.id}, {userGoogleEventId : evt.id})
							.exec(function(err, data){});
						});
					}
				})
			});
		});
	},

	destroy:function(req, res){
		Training.findOne(req.params.id)
		.populate('purchase')
		.exec(function(err, data){
			if(err || !data){
				console.error(err);
				return res.badRequest(err);
			}

			let qs = [];

			qs.push(TrainPlanPurchase.update({id: data.purchase.id},{trainsLeft: data.purchase.trainsLeft + 1, isActive: true}));
			qs.push(Training.destroy({id:req.params.id}).fetch());

			Q.all(qs)
			.catch(function(err){
				if(err){
					console.error(err);
					return res.badRequest(err);
				}
			})
			.then(function(data){
				let training = data[1][0];
				res.json(data[1][0]);
				if(training && training.userGoogleEventId){
					googleCalendarService.deleteEvent(training.userGoogleEventId)
					.catch(function(err){
						console.error(err);
					})
					.then(function(evt){
						//Do nothing.
					});
				}

			});
		});
	}
};

