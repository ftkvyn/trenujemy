module.exports = function(req, res, next) {

  if (!req.session.user) {
    return res.forbidden('You are not permitted to perform this action.');
  }

  User.findOne({id: req.session.user.id})
  .exec(function(err, user){
  	if(err || !user){
  		console.error(err);
  		return res.forbidden('You are not permitted to perform this action.');		
  	}
  	if(user.role != 'user'){
  		return res.forbidden('You are not permitted to perform this action.');		
  	}
  	return next();  
  });  
};
