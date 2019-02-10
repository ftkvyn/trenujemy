/**
 * NotificationsController
 *
 * @description :: Server-side logic for managing Trainplans
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res){
		PromoCode.find({trainer: req.session.user.id})
		.populate('user')
		.populate('feedPlan')
		.populate('trainPlan')
		.exec(function(err, data) {
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.json(data);
		})
	},

	generate: function(req, res) {
		if(!req.body.feedPlan && !req.body.trainPlan){
			return res.badRequest('No train plan nor feed plan selected');
		}
		if(req.body.feedPlan && req.body.trainPlan){
			return res.badRequest('Both train plan and feed plan selected');
		}
		const model = {
			trainer: req.session.user.id
		};
		if(req.body.feedPlan){
			model.feedPlan = req.body.feedPlan;
		}
		if(req.body.trainPlan){
			model.trainPlan = req.body.trainPlan;
		}
		promoCodeGenerator.generateCode()
		.then(function(code) {
			model.value = code;
			PromoCode.create(model)
			.exec(function(err, data) {
				if(err){
					console.error(err);
					return res.badRequest(err);
				}
				return res.json(data);
			})
		})
		.catch(function(err) {
			console.error(err);
			return res.badRequest(err);
		})
	},
};

