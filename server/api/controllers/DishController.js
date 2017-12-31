/**
 * DishController
 *
 * @description :: Server-side logic for managing Trainplans
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const Q = require('q');
const dishTimes = [800,1000,1200,1600,1900,2130];

module.exports = {
	addComponent: function(req, res) {
		let model = req.body;
		model.dish = +model.dish;
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
			//ToDo: load calories and stuff
			let component = componentsService.getComponents()[model.num];
			delete model.num;
			for(var key in component){
				if(key == 'name' || key == 'num'){
					continue;
				}
				model[key] = (component[key] / 100) * model.weight;
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

	findDishes:function(req, res){
		Dish.find({dailyReport: req.params.dayId})
		.sort('hour ASC')
		.populate('components')
		.exec(function (err, dishes) {
			if(err){
				console.error(err);
				return res.badRequest(err);
			}		
			return res.json(dishes);
		})
	},

	saveDish:function(req, res){
		let model = req.body;
		Dish.update({id: model.id}, model)
		.exec(function(err,data){
			if(err){
				console.error(err);
				return res.badRequest();
			}
			return res.json(data);
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
	},

	loadComponents: function(req, res){
		let components = componentsService.getComponents();
		return res.json(components);
	}

};

