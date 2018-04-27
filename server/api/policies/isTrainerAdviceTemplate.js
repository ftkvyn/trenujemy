//isTrainerAdviceTemplate.js

module.exports = function(req, res, next) {
	trainerEntityService.checkTrainer(AdviseTemplate , req.params.id, req.session.user.id)
	.then(function(){
		return next(); 
	})
	.catch(function(err){
		return res.forbidden(err);
	})
	.done();
}