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
	}
};

