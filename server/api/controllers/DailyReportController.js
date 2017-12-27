/**
 * DailyReportController
 *
 * @description :: Server-side logic for managing Advicecontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const moment = require('moment');
const Q = require('q');
const dishTimes = [800,1000,1200,1600,1900,2130];

module.exports = {

	find:function(req, res){
		var model = req.body;
		var userId = req.params.userId || req.session.user.id;
		var date = moment(req.params.date + ' +0000', 'DD-MM-YYYY Z');
		DailyReport
		.findOne({user: userId, date: date.toDate()})
		.populate('bodySize')
		.populate('trainings')		
		//ToDo: load dishes separate
		//.populate('dishes')
		.exec(function(err, entry){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			if(entry){
				return res.json(entry);
			}
			if(req.session.user.role == 'trainer'){
				//Not creating new data here.
				return res.json({noData: true});
			}			
			BodySize.create({user: userId})
			.exec(function(err, bodySize){
				DailyReport.create({user: userId, date: date.toDate(), bodySize: bodySize})
				.exec(function(err, entry){
					if(err){
						console.error(err);
						return res.badRequest(err);
					}
					let qs = [];
					for(let i = 0; i < dishTimes; i++){
						qs.push(Dish.create({dailyReport: entry.id, hour: dishTimes[i]}));
					}
					Q.all(qs)
					.catch(function(err){
						console.error(err);
						return res.badRequest(err);
					})
					.done(function(data){
						entry.bodySize = bodySize;
						entry.trainings = [];
						//entry.dishes = data;
						return res.json(entry);	
					});					
				});
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

	update:function(req, res){
		const userId = req.params.userId || req.session.user.id;
		if(req.session.user.role != 'trainer' && !req.params.userId){
			return req.forbidden();
		}
		let model = req.body;
		if(req.session.user.role == 'trainer'){
			delete model.userNotes;
		}else{
			delete model.trainerNotes;
		}
		DailyReport.update({id: req.params.dayId}, model)
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest();
			}
			return res.json(data[0]);
		});
	},

	saveBodySize:function(req, res){
		const model = req.body;
		BodySize.update({id: model.id, user: req.session.user.id}, model)
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest();
			}
			return res.json(data[0]);
		});
	},

	getPastImages:function(req, res){
		const userId = req.params.userId || req.session.user.id;
		const date = moment(req.params.date + ' +0000', 'DD-MM-YYYY Z');
		DailyReport.find({user: userId, image: {'!': null}, date: {'<': date.toDate()}})
			.sort('date DESC')
			.limit(4)
			.exec(function(err, data){
				if(err){
					console.error(err);
					return res.badRequest();
				}
				const result = data.map((item) => {
					let mapped = {};
					mapped.date = moment(item.date).format('DD-MM-YYYY');
					mapped.image = item.image;
					return mapped;
				});
				return res.json(result);
			});
	}
};

