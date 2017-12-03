module.exports={
	uploadImage: function(req, res){
		req.file('file').upload({
			dirname: sails.config.appPath + '/.tmp/upload/',
			maxBytes: 10000000
		},function (err, uploadedFiles){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			if(uploadedFiles.length){
				var model = {};
				model.fileData = uploadedFiles[0].fd;
				model.originalName = uploadedFiles[0].filename;
				var name = req.session.user.name || 'user_' + req.session.user.id;
				model.name = name;
				model.type = uploadedFiles[0].type;
				s3Uploader.uploadImg(model)
				.then(function(data){
					return res.json({url: data.url});
				})
				.catch(function(err){
					return res.badRequest(err);
    			})
    			.done();
			}else{
				return res.send("no files uploaded");
			}
		});
	},

	uploadFile: function(req, res){
		req.file('file').upload({
			dirname: sails.config.appPath + '/.tmp/upload/',
			maxBytes: 10000000
		},function (err, uploadedFiles){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
			if(uploadedFiles.length){
				var model = {};
				model.fileData = uploadedFiles[0].fd;
				model.originalName = uploadedFiles[0].filename;
				var name = req.session.user.name || 'user_' + req.session.user.id;
				model.name = name;
				model.type = uploadedFiles[0].type;
				s3Uploader.uploadFile(model)
				.then(function(data){
					return res.json({key: data.key, name: model.originalName});
				})
				.catch(function(err){
					return res.badRequest(err);
    			})
    			.done();
			}else{
				return res.send("no files uploaded");
			}
		});
	}
}