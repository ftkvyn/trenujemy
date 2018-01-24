// CartController
const Q = require('q');
const request = require('request');
const md5 = require('md5');
const uuidv4 = require('uuid/v4');

const pos_id = process.env.TRENUJEMY_POS_ID;
const merchant_id = process.env.TRENUJEMY_MERCHANT_ID;
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
	    	//ToDo: check if user have existing feed plan.
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
		User.findOne(req.session.user.id)
		.exec(function(err, user){
			if(err){
				console.error(err);
				return res.badRequest(err);
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
				    	p24_url_return: process.env.TRENUJEMY_ROOT_HOST + '/paymentEnd',
				    	p24_url_status: process.env.TRENUJEMY_ROOT_HOST + '/verify',
				    	p24_api_version: '3.2'				    	
				    	//p24_sign: md5Hash
					};

					for(let i = 0, i < cartItems.length; i++){
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
						paymentData['p24_quantity_' + (i+1)] = 1;
						paymentData['p24_price_' + (i+1)] = item.price * 100;
						paymentData['p24_number_' + (i+1)] = item.id;
					}

					const sign = `${paymentData.p24_session_id}|${paymentData.p24_merchant_id}|${paymentData.p24_amount}|${paymentData.p24_currency}|${crc}`;
					const md5Hash = md5(sign);
					paymentData.p24_sign = md5Hash;

					console.log("====== Requesting przelewy 24 ======");
					console.log(paymentData);
					cartService.initCart(req, true);

					let postOptions = {  
					    url: payment_url + '/trnRegister',
					    form: paymentData
					};

					request.post(options, function(err, response, body) {  
						if(err){
							console.error(err);
							req.session.cartMessage = 'Błąd płatności';
							return res.redirect('/cart');
						}
						console.log("====== Przelewy 24 response ======");
					    console.log(body);
					    if(body.token){
						    return res.redirect(payment_url + '/trnRequest/' + body.token);
						}else{
							console.error(body.errorMessage);
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

			const sign = `${paymentData.p24_session_id}|${paymentData.p24_order_id}|${paymentData.p24_amount}|${paymentData.p24_currency}|${crc}`;
			const md5Hash = md5(sign);
			verifyData.p24_sign = md5Hash;

			let postOptions = {  
			    url: payment_url + '/trnVerify',
			    form: verifyData
			};

			request.post(options, function(err, response, body) {  
				if(err){
					console.error(err);
					return res.badRequest();
				}
				console.log("====== Przelewy verify 24 response ======");
			    console.log(body);
			    if(!body.errorMessage){
				    return res.send('Ok');
				}else{
					console.error(body.errorMessage);
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