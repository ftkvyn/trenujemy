module.exports = {
	getUserData: function(req,res){
		var model = req.session.user;
		if(!model){
			return res.json({});
		}
		delete model.password;
		delete model.activationCode;
		delete model.passwordRecoveryKey;

		return res.json(model);
	},
}