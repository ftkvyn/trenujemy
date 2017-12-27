/**
 * DishController
 *
 * @description :: Server-side logic for managing Trainplans
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	addComponent: function(req, res) {
		let model = req.body;
		Dish.findOne({id: model.dish})
		.populate('dailyReport')
		.exec(function(err, dish){
			if(err){
				console.error(err);
				return res.badRequest();
			}
			if(!dish || !dish.dailyReport){
				return res.notFound();	
			}
			if(dish.dailyReport.user != req.session.user.id){
				return res.forbidden();		
			}
			DishComponent.create(model)
			.exec(function(err, data){
				if(err){
					console.error(err);
					return res.badRequest();
				}
				return res.json(data);
			});
		});		
	},

	removeComponent: function(req, res) {
		let model = req.body;
		Dish.findOne({id: model.dish})
		.populate('dailyReport')
		.exec(function(err, dish){
			if(err){
				console.error(err);
				return res.badRequest();
			}
			if(!dish || !dish.dailyReport){
				return res.notFound();	
			}
			if(dish.dailyReport.user != req.session.user.id){
				return res.forbidden();		
			}
			DishComponent.destroy({id: model.id})
			.exec(function(err, data){
				if(err){
					console.error(err);
					return res.badRequest();
				}
				return res.json(data);
			});
		});		
	}

};

