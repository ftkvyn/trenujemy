//friendlyIdService

const routeSymbols = '1234567890-_qwertyuiopasdfghjklzxcvbnm';
const routeReplacements = [];
routeReplacements['ą'] = 'a';
routeReplacements['ż'] = 'z';
routeReplacements['ź'] = 'z';
routeReplacements['ś'] = 's';
routeReplacements['ę'] = 'e';
routeReplacements['ć'] = 'c';
routeReplacements['ń'] = 'n';
routeReplacements['ó'] = 'o';
routeReplacements['ł'] = 'l';

exports.findFriendlyId = function(Entity, idSource, excludeId, cb){
	try{
		let friendlyIdSrc = idSource.toLocaleLowerCase();
		let resultRoute = '';
		for(let i = 0; i < friendlyIdSrc.length; i++){
			if(routeReplacements[friendlyIdSrc[i]]){
				resultRoute += routeReplacements[friendlyIdSrc[i]];
			}else{
				if(routeSymbols.indexOf(friendlyIdSrc[i]) > -1){
					resultRoute += friendlyIdSrc[i];
				}
			}
		}
		var findExistingEntity = function(friendlyId, count){
			Entity.findOne({friendlyId:friendlyId})
			.exec(function(err, entity){
				try{
					if(err){
						return cb(err);
					}
					if(entity && entity.id != excludeId){
						if(count == 0){
							friendlyId += '_';	
						}
						count++;
						friendlyId += count;
						findExistingEntity(friendlyId, count);
					} else{
						return cb(null, friendlyId);
					}
				}
				catch(err){
					cb(err);
				}
			});
		}
		findExistingEntity(resultRoute, 0);
	}
	catch(err){
		cb(err);
	}
}
