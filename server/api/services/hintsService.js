const Q = require('q');

const _hintPeriodsConfig = [
['never', null], 
['weekly', '0 8 * * 1'], 
['each_third_day', '0 8 */3 * *'], 
['each_second_day', '0 8 */2 * *'],
['each_day', '0 8 * * *'], 
['twice_a_day', '0 8,16 * * *']];

const _hintPeriods = _hintPeriodsConfig.map( item => item[0] );

exports.hintPeriods = [... _hintPeriods];
exports.hintConfigs = [... _hintPeriodsConfig];


exports.sendHints = function(period){
	TrainerInfo.find()
	.exec(function(err, trainers){
		if(err){
			console.error('Error sending hints - loading trainer info');
			console.error(err);
			return;
		}
		if(!trainers){
			console.error('Error sending hints - no trainer info found');
			return;
		}
		if(!trainers[0].sendHints){
			console.log('Not sending any hints - disabled by trainer');
			return;
		}
		if(!hintPeriods.some( item => item == period)){
			console.error('Error sending hints - wrong period: ' + period);
		}
		UserRequirement.find({sendTips: period})
		.exec(function(err, usersData){
			if(err){
				console.error('Error sending hints - loading users');
				console.error(err);
				return;
			}
			if(!usersData || !usersData.length){
				console.log(`Not sending any hints ${period} - no such users`);
				return;
			}
			userIds = usersData.map( item => item.user);

			let qs = [];
			qs.push(TrainerHints.find());
			qs.push(UserHints.find({user: userIds}));
			Q.all(qs)
			.catch(function(err){
				if(err){
					console.error('Error sending hints - loading hints');
					console.error(err);
					return;
				}
			})
			.then(function(data){
				const hints = data[0];
				const userHints = data[1];
				let createQs = [];
				for(let i = 0; i < userIds.length; i++){
					let id = userIds[i];
					let oldHintIds = userHints.filter( item => item.user == id).map( item => item.hint);
					let notUsedHints = hint.filter( item => !oldHintIds.some( oldItemId => oldItemId == item.id ));
					if(notUsedHints.length){
						let newHint = notUsedHints[Math.floor(Math.random()*notUsedHints.length)];
						let model = {
							user: id,
							hint: newHint.id,
							text: newHint.text,
							isRead: false
						};
						createQs.push(UserHints.create(model));
					}
				}
				Q.all(qs)
				.catch(function(err){
					if(err){
						console.error('Error sending hints - creating hints');
						console.error(err);
						return;
					}
				})
				.then(function(data){
					console.log('-------- created hints -------------');
					console.log(data);
				});
			});	
		});

		
	});
}