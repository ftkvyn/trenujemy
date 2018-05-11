//transactionsService
const Q = require('q');

exports.finalizeTransaction = function(paymentId) {
	let deferred = Q.defer();
	Transaction.update({externalId: paymentId}, {status: 'Complete'})
	.fetch()
	.exec(function(err, transactions){
		try{
			cartService.purchaseItems(transactions)
			.catch(function(err){
				console.error(err);
				Transaction.update({externalId: paymentId}, {status: 'Error while creating purchases', errorMessage: err.toString()})
				.exec(function(){
					//Do nothing.						
				});
				deferred.reject(err);
			})
			.done(function(data){
				console.log('=========Created items:==========');
				console.log(data);
				let qs = [];								
				qs.push(User.findOne(transactions[0].user));
				Q.all(qs)
				.catch(function(err){
					console.error(err);
					deferred.reject(err);
				})
				.then(function(data){
					let items = transactions.map(transaction => transaction.item);
						let user = data[0];
					let emailModel = {};
					emailModel.name = user.name || user.login;
					emailModel.email = user.login;
					emailModel.trainPlans = [];
					for(let i = 0; i < items.length; i++){
						let item = items[i];
						if(item.isFeedPlan){
							if(item.isFreeSample){
								emailModel.feedPlanName = `Piersza darmowa konsultacja, konsultant ${item.trainer.name} `;	
							}else{
								emailModel.feedPlanName = `Konsultacja dietetyczna na ${item.weeks}-tydodniowy okres, konsultant ${item.trainer.name} `;
								emailModel.feedPlanWithConsult = item.isWithConsulting;
							}							
						}else{
							emailModel.trainPlans.push(item.name + " - " + item.trainer.name);
						}
					}
					emailService.sendNewTransactionMail(emailModel);

					let trainerIds = transactions.map(transaction => transaction.trainer);
		            for (var t = trainerIds.length - 1; t >= 0; t--) {
		              let trainerId = trainerIds[t];
		              let trainerTransactions = transactions.filter(transaction => transaction.trainer == trainerId);

		              let trainerEmailModel = {};
		              trainerEmailModel.userName = user.name || user.login;              
		              trainerEmailModel.trainPlans = [];
		              for(let i = 0; i < trainerTransactions.length; i++){
		                let item = trainerTransactions[i].item;
		                trainerEmailModel.email = item.trainer.login;
		                trainerEmailModel.trainerName = item.trainer.name;
		                if(item.isFeedPlan){
		                  if(item.isFreeSample){
		                    trainerEmailModel.feedPlanName = `Piersza darmowa konsultacja`;
		                  }else{
		                    trainerEmailModel.feedPlanName = `Konsultacja dietetyczna na ${item.weeks}-tydodniowy okres`; 
		                    trainerEmailModel.feedPlanWithConsult = item.isWithConsulting;
		                  }                      		                  
		                }else{
		                  trainerEmailModel.trainPlans.push(item.name);
		                }
		              }
		              emailService.sendTrainerNewTransactionMail(trainerEmailModel);
		            }
		            deferred.resolve(data);
				});
			});		
		}
		catch(ex){
			console.error(ex);
			Transaction.update({externalId: paymentId}, {status: 'Error while creating purchases', errorMessage: ex.toString()})
			.exec(function(){
				//Do nothing.						
			});
			deferred.reject(ex);
		}
	});
	return deferred.promise;
}

