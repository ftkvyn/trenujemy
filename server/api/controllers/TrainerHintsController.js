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
			res.json(data);

			setTimeout(function(){
				UserHints.update({user: userId}, {isRead: true})
				.exec(function(err, data){});
			}, 2000);
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

