/**
 * DailyTrainingController
 *
 * @description :: Server-side logic for managing Trainplans
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const moment = require('moment');
const Q = require('q');

module.exports = {
	updateOrCreate: function(req, res) {
		let model = req.body;
		let query;
		if(!model.id){
			query = DailyTraining.create(model).fetch();
		}else{
			query = DailyTraining.update({id: model.id}, model).fetch();
		}
		query.exec(function(err, data){
			if(err){
				console.error(err);
				return res.badRequest();
			}
			let result = data;
			if(!result.id){
				result = data[0];
			}
			return res.json(result);
		});
	},

	getTrainingTypes: function(req, res){
		var userId = req.params.userId || req.session.user.id;
		let days = req.body.days.map((day) => moment(day + ' +0000', 'DD-MM-YYYY Z').startOf('day').toDate());
		let qs = [];
		for(let i = 0; i < days.length; i++){
			qs.push(DailyReport.find({date: days[i].toString(), user: userId}).limit(1).populate('trainings'));
		}
		Q.all(qs)
		.then(function(data){
			if(!data){
				return res.json([]);
			}
			data = data.filter(items => !!items && items[0]).map(items => items[0]).sort((a,b) => a.date - b.date);
			let result = [];
			let num = 0;
			for(let i = 0; i < days.length; i++){
				let item = {};
				item.date = moment(days[i]).format('DD-MM-YYYY');				
				item.type = 'none';
				if(data[num]){
					const loadedDate = moment(data[num].date).format('DD-MM-YYYY');
					if(loadedDate == item.date){
						let training = data[num].trainings.sort((a,b) => b.length - a.length)[0];
						if(training){
							item.type = training.type;
						}
						num++;
					}
				}
				result.push(item);
			}
			return res.json(result);
		})
		.catch(function(err){
			console.error(err);
			return res.badRequest(err);
		})
		.done();
	}

};

