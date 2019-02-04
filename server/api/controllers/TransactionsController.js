/**
 * TransactionsController
 *
 * @description :: Server-side logic for managing Trainplans
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const Q = require('q');
const moment = require('moment');

module.exports = {
	find:  function(req, res){
		let condition = {};
		let low = null;
		let high = null;
		if(req.params.month == 'all'){
			low = moment(`${req.params.year}-01-01`, "YYYY-MM-DD").toDate();
			high = moment(`${req.params.year}-01-01`, "YYYY-MM-DD").add(1, 'years').toDate();
		}else{
			low = moment(`${req.params.year}-${req.params.month}-01`, "YYYY-MM-DD").toDate();
			high = moment(`${req.params.year}-${req.params.month}-01`, "YYYY-MM-DD").add(1, 'months').toDate();
		}
		condition.createdAt = { '>=': low, '<': high };
		condition.status = 'Complete';
		condition.trainer = req.session.user.id;
		Transaction.find(condition)
		.populate('user')
		.populate('promoCode')
		.sort('createdAt DESC')
		.exec(function(err, data) {
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.json(data);
		})
	},
};

