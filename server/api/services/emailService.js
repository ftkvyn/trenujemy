var helper = require('sendgrid').mail;
var from_email = new helper.Email('service@trenujemy.com');
var rootHost = process.env.TRENUJEMY_ROOT_HOST;

function sendMail(toMail, body){
	var to_email = new helper.Email(toMail);
	var subject = 'Zmiana hasła';
	var content = new helper.Content('text/plain', body);
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
	sendMail(user.email || user.login, `Link do zmiany hasła: ${rootHost}changePassword?code=${user.passwordRecoveryKey}`);
}

exports.sendActivationMail = function(user) {
	sendMail(user.email || user.login, `Link do aktywacji: ${rootHost}auth/activate?activationCode=${user.activationCode}`);
}