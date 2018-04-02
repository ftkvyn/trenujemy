/**
 * DishController
 *
 * @description :: Server-side logic for managing Trainplans
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const Q = require('q');
const dishTimes = [800,1000,1200,1600,1900,2130];
const POPULAR_COMPONENTS_SQL=`
SELECT dc.name, avg(dc.weight) weight, count(d.id) count FROM 
 user usr
 join dailyreport dr on dr.user = usr.id
 join dish d on d.dailyReport = dr.id
 join dishcomponent dc on dc.dish = d.id 
 where usr.id = ?
 group by dc.name;
`

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
			let component = componentsService.getComponents().find(item => item.num == model.num);
			delete model.num;
			for(var key in component){
				if(key == 'name' || key == 'num'){
					continue;
				}
				model[key] = component[key] * ( model.weight / 100);
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
		.fetch()
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
			.fetch()
			.exec(function(err, data){
				if(err){
					console.error(err);
					return res.badRequest();
				}
				return res.json(data[0]);
			});
		});		
	},

	loadComponents: function(req, res){
		let components = componentsService.getComponents();
		return res.json(components);
	},

	loadUserPreferredComponents: function(req, res){
		try{
			Dish.query(POPULAR_COMPONENTS_SQL, [req.session.user.id], function(err, rawResult) {
				if(err){
					console.error(ex);
					return res.badRequest();		
				}
				if(rawResult && rawResult.length){
					let result = rawResult
						.map( item => { return {name : item.name, count: item.count, weight: item.weight}})
						.sort( (valA, valB) => valA.count - valB.count);
					return res.json(result);
				}else{
					return res.json([]);
				}
			});
		}catch(ex){
			console.error(ex);
			return res.badRequest();
		}
	}	
};

