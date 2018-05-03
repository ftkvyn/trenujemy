const Q = require('q');
const moment = require('moment');

exports.notifyUsers = function(){

	const limitDate = moment().add(10, 'minutes').toDate();
	console.log('sending email notifications');
	// const limitDate = moment().add(30, 'seconds').toDate();
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
		console.log(data);

		const advices = data[0];
		const reports = data[1];
		const trainings = data[2];


		let updateQs = [];
		for(let i = 0; i < advices.length; i++){
			let advice = advices[i];
			console.log('sending email for updated advice ' + advice.id);
			updateQs.push(Advice.update({id: advice.id}, {shouldSendEmail: false}));
		}
		for(let i = 0; i < reports.length; i++){
			let report = reports[i];
			console.log('sending email for updated report ' + report.id);
			updateQs.push(DailyReport.update({id: report.id}, {shouldSendEmail: false}));
		}
		for(let i = 0; i < trainings.length; i++){
			let training = trainings[i];
			console.log('sending email for updated training ' + training.id);
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