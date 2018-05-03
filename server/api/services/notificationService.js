const Q = require('q');
const moment = require('moment');

exports.notifyUsers = function(){

	const limitDate = moment().add(10, 'minutes').toDate();
	console.log('sending email notifications');
	let loadQs = [];

	loadQs.push(Advice.find({shouldSendEmail: true, updatedAt : {'<' : limitDate}}).populate('user').populate('trainer'));
	loadQs.push(DailyReport.find({shouldSendEmail: true}).populate('user').populate('lastEditedTrainer'));
	loadQs.push(Training.find({shouldSendEmail: true}).populate('user').populate('trainer'));

	Q.all(loadQs)
	.catch(function(err){
		if(err){
			console.error('Error sending notifications');
			console.error(err);
		}
	})
	.then(function(data){
		const advices = data[0];
		const reports = data[1];
		const trainings = data[2];

		let updateQs = [];
		for(let i = 0; i < advices.length; i++){
			const advice = advices[i];
			try{				
				let model = {};
				model.userName = advice.user.name || advice.user.login;
				model.trainerName = advice.trainer.name;
				model.email = advice.user.login;
				model.trainerId = advice.trainer.id;
				console.log('sending email for updated advice ' + advice.id);
				emailService.sendAdviceMail(model);
			}
			catch(err){
				console.error('error sendign advice notification');
				console.error(err);
			}
			updateQs.push(Advice.update({id: advice.id}, {shouldSendEmail: false}));
		}
		for(let i = 0; i < reports.length; i++){
			let report = reports[i];
			try{				
				console.log('sending email for updated report ' + report.id);
				let model = {};
				model.userName = report.user.name || report.user.login;
				model.trainerName = report.lastEditedTrainer.name;
				model.email = report.user.login;
				model.date = moment(report.date).format('DD.MM.YYYY');
				model.dateStr = report.dateStr;
				emailService.sendDiaryMail(model);
			}
			catch(err){
				console.error('error sendign report notification');
				console.error(err);
			}
			updateQs.push(DailyReport.update({id: report.id}, {shouldSendEmail: false}));

		}
		for(let i = 0; i < trainings.length; i++){
			let training = trainings[i];
			try
			{				
				console.log('sending email for updated training ' + training.id);
				let model = {};
				model.userName = training.user.name || training.user.login;
				model.trainerName = training.trainer.name;
				model.email = training.user.login;
				model.date = moment(training.date).format('DD.MM.YYYY');
				model.place = training.place;
				emailService.sendTrainingMail(model);
			}
			catch(err){
				console.error('error sendign training notification');
				console.error(err);
			}
			updateQs.push(Training.update({id: training.id}, {shouldSendEmail: false}));
		}
		Q.all(updateQs)
		.catch(function(err){
			if(err){
				console.error('Error sending notifications');
				console.error(err);
			}
		})
		.then(function(data){
			//do nothing.
			console.log(`Updated ${data.length} items`);
		});
	});
}