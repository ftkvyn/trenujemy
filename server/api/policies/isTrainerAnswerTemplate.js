//isTrainerAnswerTemplate

module.exports = function(req, res, next) {
	trainerEntityService.checkTrainer(AnswerTemplate , req.params.id, req.session.user.id)
	.then(function(){
		return next(); 
	})
	.catch(function(err){
		return res.forbidden(err);
	})
	.done();
}