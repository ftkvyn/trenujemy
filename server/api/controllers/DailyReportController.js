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
		.find({user: userId, dateStr: date.format('YYYY-MM-DD')})
		.limit(1)
		.populate('bodySize')
		.populate('trainings')		
		.exec(function(err, entries){	
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			if(entries && entries[0]){
				return res.json(entries[0]);
			}
			if(req.session.user.role == 'trainer')
			{
				//Not creating new data here.
				return res.json({noData: true});
			}			
			BodySize.create({user: userId})
			.exec(function(err, bodySize){
				let reportDate = date.clone().utcOffset(0);

				DailyReport.create({user: userId, date: reportDate.toDate(), dateStr: reportDate.format('YYYY-MM-DD') , bodySize: bodySize.id})
				.exec(function(err, entry){
					if(err){
						console.error(err);
						return res.badRequest(err);
					}
					let qs = [];
					for(let i = 0; i < dishTimes.length; i++){
						qs.push(Dish.create({dailyReport: entry.id, hour: dishTimes[i]}));
					}
					Q.all(qs)
					.catch(function(err){
						console.error(err);
						return res.badRequest(err);
					})
					.then(function(data){
						entry.bodySize = bodySize;
						entry.trainings = [];
						return res.json(entry);	
					});					
				});
			});
		});
	},		

	update:function(req, res){
		const userId = req.params.userId || req.session.user.id;
		if(req.session.user.role != 'trainer' && !req.params.userId){
			return req.forbidden();
		}
		let model = req.body;
		delete model.date;
		if(req.session.user.role == 'trainer'){
			delete model.userNotes;
		}else{
			delete model.trainerNotes;
		}
		DailyReport.update({id: req.params.dayId}, model)
		.fetch()
		.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest();
			}
			if(req.session.user.role == 'trainer' && model.trainerNotes){
				Notifications.findOne( {user: data[0].user} )
				.exec(function(err, notification){
					let days = notification.diaryDays || [];
					let dayStr =  moment(data[0].date).format('DD-MM-YYYY');
					if(!days.some( day => day == dayStr)){
						days = [...days, dayStr];
						Notifications.update({id: notification.id},{diaryDays : days})
						.exec(function(err, data){
							//Do nothing
						});
					}
				});
			}
			return res.json(data[0]);
		});
	},

	saveBodySize:function(req, res){
		const model = req.body;
		BodySize.update({id: model.id, user: req.session.user.id}, model)
		.fetch()
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
		var date = moment(req.params.date + ' +0000', 'DD-MM-YYYY Z');
		DailyReport.find({user: userId, image: {'!=': ""}, date: {'<': date.toDate()}})
			.sort('date DESC')
			//.limit(4)
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

