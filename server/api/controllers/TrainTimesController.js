/**
 * TrainTimesController
 *
 * @description :: Server-side logic for managing Traintimes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find:  function(req, res){
		TrainTimes.find()
		.exec(function(err, data) {
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			if(data.length){
				return res.json(data);
			}
			const days = [1,2,3,4,5,6,7];
			const initHours = days.map((day) => {return {
	          dayOfWeek: day,
	          fromTime: 0,
	          toTime: 0
	        }});
	        TrainTimes.create(initHours)
	        .exec(function(err, data) {
				if(err){
					console.error(err);
					return res.badRequest(err);
				}
				return res.json(data);
			});
		});
	}
};

