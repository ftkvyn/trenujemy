/**
 * FeedPlanController
 *
 * @description :: Server-side logic for managing Feedplantargets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find:  function(req, res){
		FeedPlan.find()
		.exec(function(err, data) {
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			if(data.length){
				return res.json(data);
			}
			const initPlans = [
				{
					months:1,
					isVisible: false,
					isWithConsulting: false
				},{
					months:1,
					isVisible: false,
					isWithConsulting: true
				},{
					months:2,
					isVisible: false,
					isWithConsulting: false
				},{
					months:2,
					isVisible: false,
					isWithConsulting: true
				},{
					months:3,
					isVisible: false,
					isWithConsulting: false
				},{
					months:3,
					isVisible: false,
					isWithConsulting: true
				},{
					months:6,
					isVisible: false,
					isWithConsulting: false
				},{
					months:6,
					isVisible: false,
					isWithConsulting: true
				},
			];
	        FeedPlan.create(initPlans)
	        .exec(function(err, data) {
				if(err){
					console.error(err);
					return res.badRequest(err);
				}
				return res.json(data);
			});
		});
	}
};

