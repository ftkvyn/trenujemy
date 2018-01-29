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
	},

	getSendHints: function(req, res) {
		TrainerInfo.findOne({user: req.session.user.id})
		.exec(function(err, data){
			if(err || !data){
				console.error(err);
				return res.badRequest(err);
			}		
			return res.json({value: data.sendHints});
		});
	},

	saveSendHints: function(req, res) {
		TrainerInfo.update({user: req.session.user.id}, {sendHints: req.body.value})
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}		
			return res.json({success: true});
		});
	},
};

