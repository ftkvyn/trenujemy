module.exports = function(req, res, next) {

  if (!req.session.user) {
    return res.forbidden('You are not permitted to perform this action.');
  }

  if(!req.params.id){
   return res.forbidden('No Id provided in params.'); 
  }

  TrainerInfo.findOne({id: req.params.id})
  .exec(function(err, info){
  	if(err || !info){
  		console.error(err);
  		return res.forbidden('You are not permitted to perform this action.');		
  	}
  	if(info.user != req.session.user.id){
  		return res.forbidden('You are not permitted to perform this action.');		
  	}
  	return next();  
  });  
};
