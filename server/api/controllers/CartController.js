// CartController
const Q = require('q');
const request = require('request');
const md5 = require('md5');
const uuidv4 = require('uuid/v4');
const queryString = require('query-string');

const pos_id = +process.env.FITELIO_POS_ID;
const merchant_id = +process.env.FITELIO_MERCHANT_ID;
const crc = process.env.FITELIO_CRC;
const payment_url = process.env.FITELIO_ENV === 'DEV' ?
 process.env.FITELIO_SANDBOX_PAYMENT_URL :
 process.env.FITELIO_PAYMENT_URL;

function calculateTotalItems(cart){
	cart.totalItems = 0;
	if(cart.feedPlan){
		cart.totalItems ++;
	}
	if(cart.trainings && cart.trainings.length){
		cart.totalItems += cart.trainings.length;
	}
	return cart;
}

module.exports = {
	addItem: function (req, res){
		cartService.initCart(req);
	    //req.session.cartMessage = 'Testing error';
	    if(req.body.feedPlan){
	    	if(req.session.cart.feedPlan){
	    		req.session.cartMessage = 'Nie możesz zakupić jednocześnie więcej niż jednej usługi tego samego typu dla jednego konta';
	    	}
	    	req.session.cart.feedPlan = req.body.feedPlan;
	    }
	    if(req.body.trainingPlan){
	    	if(!req.session.cart.trainings){
	    		req.session.cart.trainings = [];
	    	}
	    	req.session.cart.trainings.push(req.body.trainingPlan);
	    }
	    calculateTotalItems(req.session.cart);
	    res.redirect('/cart');
	},

	removeItem: function (req, res){
		cartService.initCart(req);
	    if(req.body.feedPlan){
	    	delete req.session.cart.feedPlan;
	    }
	    if(req.body.trainingPlan){
	    	if(req.session.cart.trainings){
	    		const index = req.session.cart.trainings.findIndex( (item) => item == req.body.trainingPlan);
	    		req.session.cart.trainings.splice(index, 1);
	    	}
	    }  
	    calculateTotalItems(req.session.cart); 
	    res.redirect('/cart');
	},

	usePromoCode: function(req, res) {
		if(!req.body.promoCode) {
			return res.badRequest('No promo code provided');
		}
		if(!req.body.isFeedPlan && !req.body.isTraining) {
			return res.badRequest('Bad request');
		}
		if(!req.body.trainer) {
			return res.badRequest('Bad request');
		}
		PromoCode.findOne({value : req.body.promoCode, trainer: req.body.trainer})
		.exec(function(err, promoCode){
			if(err || !promoCode){
				return res.badRequest(err);
			}
			if(promoCode.transaction || promoCode.user) {
				return res.badRequest({isUsed: true});
			}
			if(req.body.isFeedPlan && !promoCode.feedPlan) {
				return res.badRequest({wrongType: true});
			}
			if(req.body.isTraining && !promoCode.trainPlan) {
				return res.badRequest({wrongType: true});
			}
			cartService.initCart(req, true);
			req.promoCode = promoCode;
			if(req.body.isFeedPlan) {
				req.session.cart.feedPlan = promoCode.feedPlan;
			} else if(req.body.isTraining) {
				req.session.cart.trainings.push(promoCode.trainPlan);
			}
			calculateTotalItems(req.session.cart);
	    	res.redirect('/cartApprove');
		});
	},

	//ToDo: handle promo codes
	payment: function(req, res){
		let qs = [];
		qs.push(User.findOne(req.session.user.id));
		qs.push(FeedPlanPurchase.find({ user: req.session.user.id, isActive: true}));
		qs.push(FeedPlanPurchase.find({ user: req.session.user.id, isFreeSample: true}));
		
		Q.all(qs)
		.catch(function(err){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
		})
		.then(function(data){
			const user = data[0];
			const plans = data[1];
			const planSamples = data[2];
			if(req.session.cart.feedPlan && plans.length){
	    		req.session.cartMessage = 'Na tym koncie aktywna jest wybrana usługa. Nie możesz mieć równocześnie więcej niż jednej aktywnej usługi tego samego typu na jednym koncie';
	    		return res.redirect('/cart');
	    	}    	

			cartService.loadCartItems(req.session.cart)
			.catch(function(err){
				req.session.cartMessage = "Błąd płatności";
				console.error(err);
				return res.redirect('/cart');
			})
			.done(function(cartItems){
				let sampleItem = null;
				for(let i = 0; i < cartItems.length; i++){
					if(cartItems[i].isFeedPlan && cartItems[i].isFreeSample){
						sampleItem = cartItems[i];
						break;
					}
				}
				if(sampleItem){
					const now = new Date();
					const weekMiliseconds = 7 * 24 * 60 * 60 * 1000;
			    	for (var i = planSamples.length - 1; i >= 0; i--) {
			    		if(sampleItem.trainer.id == planSamples[i].trainer){
			    			req.session.cartMessage = 'Nie możesz kupić jeszcze jednej darmowej konsulacji od tego trenera.';
	    					return res.redirect('/cart');
			    		}
			    		if(now - new Date(sampleItem.createdAt) < weekMiliseconds){
			    			req.session.cartMessage = 'Możesz skorzytać z pierwszej darmowej konsultacji nie częściej niż raz na 7 dni';
	    					return res.redirect('/cart');
			    		}
			    	}
			    }
				const totalPrice = cartItems.reduce( (accumulator, currentItem) => accumulator + currentItem.price, 0);
				let transactionModels = [];
				let paymentId = uuidv4();
				for(let i = 0; i < cartItems.length; i++){
					const newTransactionModel = {
						user: req.session.user.id,
						item: cartItems[i],
						amount: cartItems[i].price * 100,
						externalId: paymentId,
						status: 'created',
						trainer: cartItems[i].trainer.id			
					};
					transactionModels.push(newTransactionModel);
				}
				
				console.log("====== CREATING TRANSACTIONS ======");
				console.log(transactionModels);
				Transaction.createEach(transactionModels)
				.fetch()
				.exec(function(err, transactions){
					if(err){
						console.error(err);
						return res.badRequest(err);
					}
					if(totalPrice === 0){
						//redirect to end.
						return res.redirect('/finalizeFreeTransaction/' + paymentId);
					}
					let paymentData = {
						p24_merchant_id: merchant_id,
				    	p24_pos_id: pos_id,
				    	p24_session_id: paymentId,
				    	p24_amount: totalPrice * 100,
				    	p24_currency: 'PLN',
				    	p24_description: 'Zakup w servisie Znany Trener 24',
				    	p24_email: user.login,
				    	p24_client: user.name,
				    	p24_country: 'PL',
				    	p24_language: 'pl',
				    	p24_url_return: process.env.FITELIO_ROOT_HOST + 'paymentEnd',
				    	p24_url_status: process.env.FITELIO_ROOT_HOST + 'verify',
				    	p24_api_version: '3.2'				    	
				    	//p24_sign: md5Hash
					};
					let title = '';

					for(let i = 0; i < cartItems.length; i++){
						let item = cartItems[i];
						if(item.isFeedPlan){
							if(item.isFreeSample){
								paymentData['p24_name_' + (i+1)] =  `Piersza darmowa konsultacja, konsultant ${item.trainer.name}`;
							}else{
								let word = 'tygodni';
	                        	if(item.weeks < 6){word = 'tygodnie';}
	                        	if(item.weeks == 1){word = 'tydzień';}
	                        	paymentData['p24_name_' + (i+1)] = `Konsultacja dietetyczna, abonament na ${item.weeks} ${word}, konsultant ${item.trainer.name}`;
	                        	if(item.isWithConsulting){
	                        		paymentData['p24_name_' + (i+1)] += ' z codzienną konsultacją';
	                        	}
	                        }
						}else{
							paymentData['p24_name_' + (i+1)] = item.name;
						}	
						title += paymentData['p24_name_' + (i+1)] + '; ';
						paymentData['p24_quantity_' + (i+1)] = 1;
						paymentData['p24_price_' + (i+1)] = item.price * 100;
						paymentData['p24_number_' + (i+1)] = item.id;
					}

					const sign = `${paymentData.p24_session_id}|${paymentData.p24_merchant_id}|${paymentData.p24_amount}|${paymentData.p24_currency}|${crc}`;
					console.log('sign = ' + sign);
					const md5Hash = md5(sign);
					paymentData.p24_sign = md5Hash;

					console.log("====== Requesting przelewy 24 ======");
					console.log(paymentData);
					
					let postOptions = {  
					    url: payment_url + '/trnRegister',
					    form: paymentData
					};

					request.post(postOptions, function(err, response, body) {  
						if(err){
							console.error(err);
							req.session.cartMessage = 'Błąd płatności';
							return res.redirect('/cart');
						}						
						console.log("====== Przelewy 24 response ======");
					    console.log(body);
					    const bodyData = queryString.parse(body);
					    if(bodyData.token){
					    	Transaction.update({externalId: paymentId}, {status: 'Redirected to płatności24', title: title})
							.exec(function(){
								//Do nothing.
							});
							cartService.initCart(req, true);
						    return res.redirect(payment_url + '/trnRequest/' + bodyData.token);
						}else{
							console.error(bodyData.errorMessage);
							Transaction.update({externalId: paymentId}, {status: 'Payment error', errorMessage: bodyData.errorMessage})
							.exec(function(){
								//Do nothing.
							});
							req.session.cartMessage = 'Błąd płatności';
							return res.redirect('/cart');
						}
					}); 
				});
			});		
		});
	},

	finalizeFreeTransaction: function(req, res){
		const paymentId = req.params.paymentId;
		Transaction.find({externalId: paymentId})
		.exec(function(err, data){
			if(err || !data || !data.length){
				console.error(err);
				return res.badRequest();
			}
			for (var i = data.length - 1; i >= 0; i--) {
				if(data[i].amount > 0){
					console.error(`Transaction ${paymentId} is not free`);
					return res.badRequest();	
				}
			}			
			transactionsService.finalizeTransaction(paymentId)
			.then(function(data){
				req.session.paymentId = paymentId;
				return res.redirect('/paymentEnd');
			})
			.catch(function(err){
				console.error(err);
				return res.badRequest();
			})
			.done();
		});
		
	},

	verify: function(req, res){
		console.log("====== Status info from payment system ======");
		console.log(req.body);
		const paymentId = req.body.p24_session_id;
		Transaction.find({externalId: paymentId})
		.exec(function(err, transactions){
			if(err){
				console.error(err);
				return res.badRequest();
			}
			if(!transactions || !transactions.length){
				console.error('Transactions with externalId=' + paymentId + ' not found.');
				return res.badRequest();
			}

			let verifyData = {
				p24_merchant_id: merchant_id,
		    	p24_pos_id: pos_id,
		    	p24_session_id: paymentId,
		    	p24_amount: req.body.p24_amount,
		    	p24_currency: 'PLN',
		    	p24_order_id: req.body.p24_order_id,
		    	//p24_sign: md5Hash
			};

			Transaction.update({externalId: paymentId}, {status: 'Verifying'})
			.exec(function(){
				//Do nothing.
			});

			const sign = `${verifyData.p24_session_id}|${verifyData.p24_order_id}|${verifyData.p24_amount}|${verifyData.p24_currency}|${crc}`;
			const md5Hash = md5(sign);
			verifyData.p24_sign = md5Hash;

			let postOptions = {  
			    url: payment_url + '/trnVerify',
			    form: verifyData
			};

			request.post(postOptions, function(err, response, body) {  
				if(err){
					console.error(err);
					return res.badRequest();
				}
				console.log("====== Przelewy 24 verify response ======");
			    console.log(body);
			    const bodyData = queryString.parse(body);
			    if(!bodyData.errorMessage){
			    	transactionsService.finalizeTransaction(paymentId);
				    return res.send('Ok');
				}
				//Transaction processing end
				else{
					console.error(bodyData.errorMessage);
					Transaction.update({externalId: paymentId}, {status: 'Error while verifying', errorMessage: bodyData.errorMessage})
					.exec(function(){
						//Do nothing.						
					});
					return res.badRequest();
				}
			}); 
		});		
	},

	testPayment: function(req, res){
		const sign = `${pos_id}|${crc}`;
		const md5Hash = md5(sign);

	    var myJSONObject = { 
	    	p24_merchant_id: merchant_id,
	    	p24_pos_id: pos_id,
	    	p24_sign: md5Hash
	    };
	    console.log(myJSONObject);

	    let options = {  
		    url: payment_url + '/testConnection',
		    form: myJSONObject
		};

		request.post(options, function(err, response, body) {  
		    console.log(body);
		    return res.redirect('/cart');
		}); 
	}
}