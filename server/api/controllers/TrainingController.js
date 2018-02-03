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
			model.userComment = req.body.comment;
		}else{
			model.trainerComment = req.body.comment;
		}
		Training.update({id: req.params.id}, model)
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.json(data);
		});
	}
};

