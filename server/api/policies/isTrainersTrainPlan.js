module.exports = function(req, res, next) {

  if (!req.session.user) {
    return res.forbidden('You are not permitted to perform this action.');
  }

  if(!req.params.id){
   return res.forbidden('No Id provided in params.'); 
  }

  TrainPlan.findOne({id: req.params.id})
  .exec(function(err, plan){
  	if(err || !plan){
  		console.error(err);
  		return res.forbidden('You are not permitted to perform this action.');		
  	}
  	if(plan.trainer != req.session.user.id){
  		return res.forbidden('You are not permitted to perform this action.');		
  	}
  	return next();  
  });  
};
