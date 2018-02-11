// CartController
const Q = require('q');
const request = require('request');
const md5 = require('md5');
const uuidv4 = require('uuid/v4');
const queryString = require('query-string');

const pos_id = +process.env.TRENUJEMY_POS_ID;
const merchant_id = +process.env.TRENUJEMY_MERCHANT_ID;
const crc = process.env.TRENUJEMY_CRC;
const payment_url = process.env.TRENUJEMY_ENV === 'DEV' ?
 process.env.TRENUJEMY_SANDBOX_PAYMENT_URL :
 process.env.TRENUJEMY_PAYMENT_URL;

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
	    	req.session.cart.target = req.body.target;
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
	    	delete req.session.cart.target;
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

	payment: function(req, res){
		let qs = [];
		qs.push(User.findOne(req.session.user.id));
		qs.push(FeedPlanPurchase.find({ user: req.session.user.id, isActive: true}));
		
		Q.all(qs)
		.catch(function(err){
			if(err){
				console.error(err);
				return res.badRequest(err);
			}
		})
		.done(function(data){
			const user = data[0];
			const plans = data[1];
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
				const totalPrice = cartItems.reduce( (accumulator, currentItem) => accumulator + currentItem.price, 0);
				const newTransactionModel = {
					user: req.session.user.id,
					cart: req.session.cart,
					amount: totalPrice * 100,
					externalId: uuidv4(),
					status: 'created'				
				};
				console.log("====== CREATING TRANSACTION ======");
				console.log(newTransactionModel);
				Transaction.create(newTransactionModel)
				.exec(function(err, transaction){
					if(err){
						console.error(err);
						return res.badRequest(err);
					}

					let paymentData = {
						p24_merchant_id: merchant_id,
				    	p24_pos_id: pos_id,
				    	p24_session_id: transaction.externalId,
				    	p24_amount: transaction.amount,
				    	p24_currency: 'PLN',
				    	p24_description: 'Zakup w servisie treningowo-dyjetytycznym',
				    	p24_email: user.login,
				    	p24_client: user.name,
				    	p24_country: 'PL',
				    	p24_language: 'pl',
				    	p24_url_return: process.env.TRENUJEMY_ROOT_HOST + 'paymentEnd',
				    	p24_url_status: process.env.TRENUJEMY_ROOT_HOST + 'verify',
				    	p24_api_version: '3.2'				    	
				    	//p24_sign: md5Hash
					};
					let title = '';

					for(let i = 0; i < cartItems.length; i++){
						let item = cartItems[i];
						if(item.isFeedPlan){
							let word = 'miesięcy';
                        	if(item.months < 6){word = 'miesiące';}
                        	if(item.months == 1){word = 'miesiąc';}
                        	paymentData['p24_name_' + (i+1)] = `Plan żywieniowy, abonament na ${item.months} ${word}`;
                        	if(item.isWithConsulting){
                        		paymentData['p24_name_' + (i+1)] += ' z codzienną konsultacją';
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
					    	Transaction.update({id: transaction.id}, {status: 'Redirected to płatności24', title: title})
							.exec(function(){
								//Do nothing.
							});
							cartService.initCart(req, true);
						    return res.redirect(payment_url + '/trnRequest/' + bodyData.token);
						}else{
							console.error(bodyData.errorMessage);
							Transaction.update({id: transaction.id}, {status: 'Payment error', errorMessage: bodyData.errorMessage})
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

	verify: function(req, res){
		console.log("====== Status info from payment system ======");
		console.log(req.body);

		Transaction.findOne({externalId: req.body.p24_session_id})
		.exec(function(err, transaction){
			if(err){
				console.error(err);
				return res.badRequest();
			}
			if(!transaction){
				console.error('Transaction ' + req.body.p24_session_id + ' not found.');
				return res.badRequest();
			}

			let verifyData = {
				p24_merchant_id: merchant_id,
		    	p24_pos_id: pos_id,
		    	p24_session_id: transaction.externalId,
		    	p24_amount: req.body.p24_amount,
		    	p24_currency: 'PLN',
		    	p24_order_id: req.body.p24_order_id,
		    	//p24_sign: md5Hash
			};

			Transaction.update({id: transaction.id}, {status: 'Verifying'})
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
			    	Transaction.update({id: transaction.id}, {status: 'Complete'})
					.exec(function(err, transactions){
						try{
							cartService.purchaseItems(transactions[0])
							.catch(function(err){
								console.error(err);
								Transaction.update({id: transactions[0].id}, {status: 'Error while creating purchases', errorMessage: err.toString()})
								.exec(function(){
									//Do nothing.						
								})
							})
							.done(function(data){
								console.log('=========Created items:==========');
								console.log(data);
								let qs = [];
								qs.push(cartService.loadCartItems(transactions[0].cart));
								qs.push(User.findOne(transactions[0].user));
								Q.all(qs)
								.catch(function(err){
									console.error(err);
								})
								.then(function(data){
									let items = data[0];
      								let user = data[1];
									let emailModel = {};
									emailModel.name = user.name || user.login;
									emailModel.email = user.login;
									emailModel.trainPlans = [];
									for(let i = 0; i < items.length; i++){
										let item = items[0];
										if(item.isFeedPlan){
											emailModel.feedPlanName = `Plan żywieniowy na ${item.months}-miesięczny okres `;
											emailModel.feedPlanWithConsult = item.isWithConsulting;
										}else{
											emailModel.trainPlans.push(item.name);
										}
									}
									emailService.sendNewTransactionMail(emailModel);
								});
							});		
						}
						catch(ex){
							console.error(ex);
							Transaction.update({id: transactions[0].id}, {status: 'Error while creating purchases', errorMessage: ex.toString()})
							.exec(function(){
								//Do nothing.						
							});
						}
					});
				    return res.send('Ok');
				}else{
					console.error(bodyData.errorMessage);
					Transaction.update({id: transaction.id}, {status: 'Error while verifying', errorMessage: bodyData.errorMessage})
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