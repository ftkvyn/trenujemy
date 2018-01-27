const helper = require('sendgrid').mail;
const from_email = new helper.Email(process.env.TRENUJEMY_FROM_EMAIL);
const rootHost = process.env.TRENUJEMY_ROOT_HOST;
const contactEmail = process.env.TRENUJEMY_CONTACT_EMAIL;
const fs = require('fs');


const activationEmailTemplate = fs.readFileSync('./emails/activate.html', 'utf8');
const passwordRecoveryEmailTemplate = fs.readFileSync('./emails/passwordRecovery.html', 'utf8');
const contactEmailTemplate = fs.readFileSync('./emails/contact.html', 'utf8');

function sendMail(toMail, subject, body){
	const to_email = new helper.Email(toMail);
	const content = new helper.Content('text/html', body);
	const mail = new helper.Mail(from_email, subject, to_email, content);

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
	sendMail(user.email || user.login, 'Zmiana hasła', body);
}

exports.sendActivationMail = function(user) {
	const body = activationEmailTemplate
		.replace('%NAME%', user.email || user.login)
		.replace('%URL%', `${rootHost}auth/activate?activationCode=${user.activationCode}`);
	sendMail(user.email || user.login, 'Aktywacja konta',body);
}

exports.sendContactMail = function(model){
	const body = contactEmailTemplate
		.replace('%NAME%', model.name)
		.replace('%EMAIL%', model.email)
		.replace('%TEXT%', model.text);
	sendMail(contactEmail, 'Formularz kontaktowy', body);

}