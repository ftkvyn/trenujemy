/**
 * TrainPlanController
 *
 * @description :: Server-side logic for managing Trainplans
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find:  function(req, res){
		TrainPlan.find({isActive: true})
		.exec(function(err, data) {
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.json(data);
		})
	},

	findAll:  function(req, res){
		TrainPlan.find()
		.exec(function(err, data) {
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			if(data.length){
				return res.json(data);
			}
			const items = [{},{},{},{}];
	        TrainPlan.createEach(items)
	        .exec(function(err, data) {
				if(err){
					console.error(err);
					return res.badRequest(err);
				}
				data = data.sort((a,b) =>{
					return a.id - b.id;
				});
				return res.json(data);
			})
		})
	}
};

