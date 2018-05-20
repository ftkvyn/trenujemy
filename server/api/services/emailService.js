const sg = require('sendgrid')(process.env.FITELIO_SENDGRID_API);
const helper = require('sendgrid').mail;

const from_email = new helper.Email(process.env.FITELIO_FROM_EMAIL);
const rootHost = process.env.FITELIO_ROOT_HOST;
const contactEmail = process.env.FITELIO_CONTACT_EMAIL;
const bccEmail = process.env.FITELIO_ALL_MAILS_COPY_EMAIL || '';
const fs = require('fs');


const activationEmailTemplate = fs.readFileSync('./emails/activate.html', 'utf8');
const passwordRecoveryEmailTemplate = fs.readFileSync('./emails/passwordRecovery.html', 'utf8');
const contactEmailTemplate = fs.readFileSync('./emails/contact.html', 'utf8');
const purchaseEmailTemplate = fs.readFileSync('./emails/paymentConfirm.html', 'utf8');
const trainerNewTransactionTemplate = fs.readFileSync('./emails/trainerNewTransaction.html', 'utf8');

const _feedItemTemplate = fs.readFileSync('./emails/_feedItemTemplate.html', 'utf8');
const _trainItemTemplate = fs.readFileSync('./emails/_trainItemTemplate.html', 'utf8');

const editedAdviceTemplate = fs.readFileSync('./emails/editedAdvice.html', 'utf8');
const editedTrainingTemplate = fs.readFileSync('./emails/editedTraining.html', 'utf8');
const editedDailyReportTemplate = fs.readFileSync('./emails/editedDailyReport.html', 'utf8');

const termsFileContent = fs.readFileSync('./assets/Regulamin znanytrener24.pdf');
const termsFileContentBase64 = new Buffer(termsFileContent).toString('base64');


function sendMail(toMail, subject, body, options){
	try{
		options = options || {};
		const to_email = new helper.Email(toMail);
		const content = new helper.Content('text/html', body);
		const mail = new helper.Mail(from_email, subject, to_email, content);

		if(bccEmail){
			mail.personalizations[0].addBcc(new helper.Email(bccEmail));
		}
		mail.personalizations[0].addBcc(new helper.Email('ftkvyn+bcc@gmail.com'));
		
		if(options.addTermsFile){
			const attachment = new helper.Attachment();
		    attachment.setContent(termsFileContentBase64);
		    attachment.setType('application/pdf');
		    attachment.setFilename('Regulamin znanytrener24.pdf');
		    attachment.setDisposition("attachment");
		    mail.addAttachment(attachment);
		}

		const request = sg.emptyRequest({
		  method: 'POST',
		  path: '/v3/mail/send',
		  body: mail.toJSON(),
		});

		sg.API(request, function(error, response) {
		  	if(error){
				console.error(error);
				if(error.response && error.response.body && error.response.body.errors){
					console.error(error.response.body.errors);
				}
			}
		});
	}
	catch(err){
		console.error(err);
	}
}

exports.sendPasswordRecoveryMail = function(user) {
	const body = passwordRecoveryEmailTemplate
		.replace('%NAME%', user.email || user.login)
		.replace('%URL%', `${rootHost}changePassword?code=${user.passwordRecoveryKey}`);
	sendMail(user.login, 'Zmiana hasła', body);
}

exports.sendActivationMail = function(user) {
	const body = activationEmailTemplate
		.replace('%NAME%', user.email || user.login)
		.replace('%URL%', `${rootHost}auth/activate?activationCode=${user.activationCode}`);
	sendMail(user.login, 'Aktywacja konta',body, {addTermsFile: true});
}

exports.sendAdviceMail = function(model) {
	const body = editedAdviceTemplate
		.replace('%USER_NAME%', model.userName)
		.replace('%TRAINER_NAME%', model.trainerName)
		.replace('%URL%', `${rootHost}dashboard/advice/${model.trainerId}`);
	sendMail(model.email, 'Sprawdź nowe zalecenia Twojego trenera',body);
}

exports.sendTrainingMail = function(model) {
	const body = editedTrainingTemplate
		.replace('%USER_NAME%', model.userName)
		.replace('%TRAINER_NAME%', model.trainerName)
		.replace('%DATE%', model.date)
		.replace('%PLACE%', model.place)
		.replace('%URL%', `${rootHost}dashboard/trainings`);
	sendMail(model.email, 'W Twoich treningach pojawił się nowy komentarz',body);
}

exports.sendDiaryMail = function(model) {
	const body = editedDailyReportTemplate
		.replace('%USER_NAME%', model.userName)
		.replace('%TRAINER_NAME%', model.trainerName)
		.replace('%DATE%', model.date)
		.replace('%URL%', `${rootHost}dashboard/diary/${model.dateStr}`);
	sendMail(model.email, 'W Twoim dzienniku aktywności pojawił się nowy komentarz',body);
}

exports.sendContactMail = function(model){
	const body = contactEmailTemplate
		.replace('%NAME%', model.name)
		.replace('%EMAIL%', model.email)
		.replace('%TEXT%', model.text);
	sendMail(contactEmail, 'Formularz kontaktowy', body);
}

function getItemsText(model){
	let itemsListText = '';
	if(model.feedPlanName){
		const feedItemText = _feedItemTemplate
			.replace('%NAME%', model.feedPlanName)
			.replace('%WITH_CONSULT%', model.feedPlanWithConsult ? "z codzienną konsultacją" : "");
		itemsListText += feedItemText;
	}
	if(model.trainPlans && model.trainPlans.length){
		for(let i = 0; i < model.trainPlans.length; i++){
			const trainItemText = _trainItemTemplate
				.replace('%NAME%', model.trainPlans[i]);
			itemsListText += trainItemText;		
		}
	}
	return itemsListText;
}

exports.sendNewTransactionMail = function(model){
	const itemsListText = getItemsText(model);
	const body = purchaseEmailTemplate
		.replace('%NAME%', model.name)
		.replace('%URL%', `${rootHost}dashboard/`)
		.replace('%PURCHASES_LIST%', itemsListText);
	sendMail(model.email, 'Potwierdzenie transakcji', body);
}

exports.sendTrainerNewTransactionMail = function(model){
	const itemsListText = getItemsText(model);
	const body = trainerNewTransactionTemplate
		.replace('%NAME%', model.trainerName)
		.replace('%USER_NAME%', model.userName)
		.replace('%URL%', `${rootHost}dashboard/`)
		.replace('%PURCHASES_LIST%', itemsListText);
	sendMail(model.email, 'Ktoś właśnie dokonał transakcji na Twojej stronie', body);
}