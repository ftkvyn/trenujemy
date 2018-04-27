/**
 * AdviseTemplateController
 *
 * @description :: Server-side logic for managing Advisetemplates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find:function(req, res){
		AdviseTemplate.find({trainer: req.session.user.id})
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.json(data);
		});
	},

	create: function(req, res){
		let model = req.body;
		model.trainer = req.session.user.id;
		AdviseTemplate.create(model)
		.fetch()
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.json(data);
		});
	}
};

