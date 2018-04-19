const fs = require('fs');
const moment = require('moment');
const Q = require('q');

const configData = JSON.parse(fs.readFileSync('./config/data/calendar.json'));
const SERVICE_ACCT_ID = 'mysampletestaccount7766@cogent-repeater-194612.iam.gserviceaccount.com';
const CALENDAR_ID = {
  'primary': 'eqe139rt2uh362kuisfeequal0@group.calendar.google.com',
};
const TIMEZONE = 'UTC+01:00';



let calendarConfig = {};

calendarConfig.key = configData.private_key;
calendarConfig.serviceAcctId = configData.client_email;
calendarConfig.calendarId = CALENDAR_ID;
calendarConfig.timezone = TIMEZONE;

const CalendarAPI = require('node-google-calendar');

function addEvent(training, userEmails){

	let deferred = Q.defer();
	try{
	    let cal = new CalendarAPI(calendarConfig);
	    let calendarId = 'primary';
	    let attendees = [];
	    for (var i = userEmails.length - 1; i >= 0; i--) {
	    	attendees.push( {email: userEmails[i]} );
	    }

	    let params = {
	        'summary': 'Trening',
	        'location': training.place,
	        'description': 'Trening - ' + training.place,
	        'start': { 'dateTime': moment(training.date).format() },
	        'end': { 'dateTime': moment(training.date).add(1,'hours').format() },
	        'status': 'confirmed',
	        'attendees': attendees,          
	    };
	       
	    cal.Events.insert(calendarId, params)
	    	.then(resp => {
	          deferred.resolve(resp);
	        })
	        .catch(err => {
	          deferred.reject(err);
	        });
	}catch(ex){
	    deferred.reject(ex);
	}
	return deferred.promise;
}

function deleteEvent(trainingGoogleId){

	let deferred = Q.defer();
	try{
	    let cal = new CalendarAPI(calendarConfig);
	    let calendarId = 'primary';
	       
	    cal.Events.delete(calendarId, trainingGoogleId)
	    	.then(resp => {
	          deferred.resolve(resp);
	        })
	        .catch(err => {
	          deferred.reject(err);
	        });
	}catch(ex){
	    deferred.reject(ex);
	}
	return deferred.promise;
}

exports.addEvent = addEvent;
exports.deleteEvent = deleteEvent;