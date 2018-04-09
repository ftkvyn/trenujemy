/**
 * FeedPlanTargetController
 *
 * @description :: Server-side logic for managing Feedplantargets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// module.exports = {
// 	find:  function(req, res){
// 		FeedPlanTarget.find()
// 		.exec(function(err, data) {
// 			if(err){
// 				console.error(err);
// 				return res.badRequest(err);
// 			}
// 			if(data.length){
// 				return res.json(data);
// 			}
// 			const initPlans = [
// 				{
// 					name:'Cel 1',
// 					isVisible: false
// 				},{
// 					name:'Cel 2',
// 					isVisible: false
// 				},{
// 					name:'Cel 3',
// 					isVisible: false
// 				},{
// 					name:'Cel 4',
// 					isVisible: false
// 				}
// 			];
// 	        FeedPlanTarget.createEach(initPlans)
// 	        .exec(function(err, data) {
// 				if(err){
// 					console.error(err);
// 					return res.badRequest(err);
// 				}
// 				return res.json(data);
// 			});
// 		});
// 	}
// };

