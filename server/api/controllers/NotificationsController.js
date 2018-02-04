/**
 * NotificationsController
 *
 * @description :: Server-side logic for managing Trainplans
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	hints:  function(req, res){
		UserHints.count({user: req.session.user.id, isRead: false})
		.exec(function(err, count) {
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.json({count: count});
		})
	},

	find: function(req, res){
		Notifications.findOne({user: req.session.user.id})
		.exec(function(err, data) {
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.json(data);
		})
	}

};

