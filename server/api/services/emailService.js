var helper = require('sendgrid').mail;
var from_email = new helper.Email('service@trenujemy.com');
var rootHost = process.env.TRENUJEMY_ROOT_HOST;
var fs = require('fs');


var activationEmailTemplate = fs.readFileSync('./emails/activate.html', 'utf8');
var passwordRecoveryEmailTemplate = fs.readFileSync('./emails/passwordRecovery.html', 'utf8');

function sendMail(toMail, body){
	var to_email = new helper.Email(toMail);
	var subject = 'Zmiana hasła';
	var content = new helper.Content('text/html', body);
	var mail = new helper.Mail(from_email, subject, to_email, content);

	var sg = require('sendgrid')(process.env.TRENUJEMY_SENDGRID_API);
	var request = sg.emptyRequest({
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
	var body = passwordRecoveryEmailTemplate
		.replace('%NAME%', user.email || user.login)
		.replace('%URL%', `${rootHost}changePassword?code=${user.passwordRecoveryKey}`);
	sendMail(user.email || user.login, body);
}

exports.sendActivationMail = function(user) {
	var body = activationEmailTemplate
		.replace('%NAME%', user.email || user.login)
		.replace('%URL%', `${rootHost}auth/activate?activationCode=${user.activationCode}`);
	sendMail(user.email || user.login, body);
}