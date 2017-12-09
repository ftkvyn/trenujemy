/**
 * AdviceController
 *
 * @description :: Server-side logic for managing Advicecontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const defaultVals = {
	fiber: 25,
  	sodium: 2400,
  	potassium: 2000,
  	calcium:800,
  	iron:14,
  	vitaminC:80,
  	vitminA:800
}

module.exports = {
	getDefaultVals:function(req, res){
		res.json(defaultVals);
	},

	find:function(req, res){
		var model = req.body;
		var userId = req.params.userId || req.session.user.id;
		Advice
		.findOne({user: userId})
		.exec(function(err, advice){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			if(advice){
				return res.json(advice);
			}
			Advice.create({user: userId})
			.exec(function(err, advice){
				if(err){
					console.error(err);
					return res.badRequest(err);
				}
				return res.json(advice);
			});
		});
	},	
};

