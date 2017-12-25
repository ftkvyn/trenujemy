/**
 * DailyTrainingController
 *
 * @description :: Server-side logic for managing Trainplans
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	updateOrCreate: function(req, res) {
		let model = req.body;
		let query;
		if(!model.id){
			query = DailyTraining.create(model);
		}else{
			query = DailyTraining.update({id: model.id}, model);
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
	}

};

