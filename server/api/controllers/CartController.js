// CartController
const Q = require('q');
const request = require('request');
const md5 = require('md5');

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
	    if(!req.session.cart){
	    	req.session.cart = {
	    		totalItems:0
	    	};
	    }
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