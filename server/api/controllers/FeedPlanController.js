/**
 * FeedPlanController
 *
 * @description :: Server-side logic for managing Feedplantargets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find:  function(req, res){
		FeedPlan.find({trainer: req.session.user.id, isVisible: true, isFreeSample: false})
		.exec(function(err, data) {
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.json(data);
		});
	}
};

