/**
 * TrainerHintsController
 *
 * @description :: Server-side logic for managing Trainerhints
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	userHints: function(req, res) {
		var userId = req.params.userId || req.session.user.id;

		UserHints.find({user: userId})
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest();
			}
			return res.json(data);
		});
	}
};

