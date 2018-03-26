// /**
//  * UserRequirementController
//  *
//  * @description :: Server-side logic for managing Userrequirements
//  * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
//  */

// module.exports = {
// 	find:function(req, res){
// 		var model = req.body;
// 		var userId = req.params.userId || req.session.user.id;
// 		UserRequirement
// 		.findOne({user: userId})
// 		.exec(function(err, requirement){
// 			if(err){
// 				console.error(err);
// 				return res.badRequest(err);
// 			}
// 			if(requirement){
// 				return res.json(requirement);
// 			}
// 			UserRequirement.create({user: userId, neck:true, shoulder:true,forearm:true,wrist:true,
// 				chest:true,waist:true,hips:true,thigh:true,shin:true})
// 			.exec(function(err, requirement){
// 				if(err){
// 					console.error(err);
// 					return res.badRequest(err);
// 				}
// 				return res.json(requirement);
// 			});
// 		});
// 	},	
// };