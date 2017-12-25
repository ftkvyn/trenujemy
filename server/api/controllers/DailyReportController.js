/**
 * DailyReportController
 *
 * @description :: Server-side logic for managing Advicecontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const moment = require('moment');

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
					return res.json(entry);
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
	}
};

