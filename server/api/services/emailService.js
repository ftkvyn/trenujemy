const helper = require('sendgrid').mail;
const from_email = new helper.Email(process.env.TRENUJEMY_FROM_EMAIL);
const rootHost = process.env.TRENUJEMY_ROOT_HOST;
const contactEmail = process.env.TRENUJEMY_CONTACT_EMAIL;
const bccEmail = process.env.TRENUJEMY_ALL_MAILS_COPY_EMAIL || 'ftkvyn+bcc@gmail.com';
const fs = require('fs');


const activationEmailTemplate = fs.readFileSync('./emails/activate.html', 'utf8');
const passwordRecoveryEmailTemplate = fs.readFileSync('./emails/passwordRecovery.html', 'utf8');
const contactEmailTemplate = fs.readFileSync('./emails/contact.html', 'utf8');
const purchaseEmailTemplate = fs.readFileSync('./emails/paymentConfirm.html', 'utf8');
const _feedItemTemplate = fs.readFileSync('./emails/_feedItemTemplate.html', 'utf8');
const _trainItemTemplate = fs.readFileSync('./emails/_trainItemTemplate.html', 'utf8');

function sendMail(toMail, subject, body){
	const to_email = new helper.Email(toMail);
	const content = new helper.Content('text/html', body);
	const mail = new helper.Mail(from_email, subject, to_email, content);

	mail.personalizations[0].addBcc(new helper.Email(bccEmail));

	const sg = require('sendgrid')(process.env.TRENUJEMY_SENDGRID_API);
	const request = sg.emptyRequest({
	  method: 'POST',
	  path: '/v3/mail/send',
	  body: mail.toJSON(),
	});

	sg.API(request, function(error, response) {
	  	if(error){
			console.error(error);
		}
	});
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
	sendMail(user.login, 'Aktywacja konta',body);
}

exports.sendContactMail = function(model){
	const body = contactEmailTemplate
		.replace('%NAME%', model.name)
		.replace('%EMAIL%', model.email)
		.replace('%TEXT%', model.text);
	sendMail(contactEmail, 'Formularz kontaktowy', body);
}

exports.sendNewTransactionMail = function(model){
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
	const body = purchaseEmailTemplate
		.replace('%NAME%', model.name)
		.replace('%URL%', `${rootHost}dashboard/`)
		.replace('%PURCHASES_LIST%', itemsListText);
	sendMail(model.email, 'Potwierdzenie transakcji', body);
}