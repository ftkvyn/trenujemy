/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

//const scheduler = require('node-schedule');
const Q = require('q');

module.exports.bootstrap = function(cb) {
  process.env.TZ = 'Europe/Warsaw';
  
  //const hintConfigs = hintsService.hintConfigs;
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  // for(let i = 0; i < hintConfigs.length; i++){
  // 	let config = hintConfigs[i][1];
  // 	let period = hintConfigs[i][0];
  // 	if(config){
  // 		let job  = scheduler.scheduleJob(config, function(){
		//     hintsService.sendHints(period);
		//   });
  // 	}
  // }
  // scheduler.scheduleJob('10 0 * * *', function(){
  //   expiringService.expirePlans();
  // });  
  cb();
};
