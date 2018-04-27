/**
 * AnswerTemplateController
 *
 * @description :: Server-side logic for managing Answertemplates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find:function(req, res){
		AnswerTemplate.find({trainer: req.session.user.id})
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
		AnswerTemplate.create(model)
		.fetch()
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.json(data);
		});
	},
};

