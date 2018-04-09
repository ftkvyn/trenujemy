module.exports = {
	find: function(req,res){
		TrainerInfo.findOne({user: req.session.user.id})
		.exec(function(err, info){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			return res.send(info);
		});
	}
}