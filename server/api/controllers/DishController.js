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

	findDishes:function(req, res){
		Dish.find({dailyReport: req.params.dayId})
		.sort('hour ASC')
		.populate('components')
		.exec(function (err, dishes) {
			if(err){
				console.error(err);
				return res.badRequest(err);
			}			
			// if(dishes.length == 0){
				//ToDo: remove code later
				// console.log('creating');
				// let qs = [];
				// for(let i = 0; i < dishTimes.length; i++){
				// 	qs.push(Dish.create({dailyReport: req.params.dayId, hour: dishTimes[i]}));
				// }
				// Q.all(qs)
				// .catch(function(err){
				// 	console.error(err);
				// 	return res.badRequest(err);
				// })
				// .done(function(data){
				// 	return res.json(data);	
				// });		
			// }else{
				return res.json(dishes);
			// }
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
	}

};

