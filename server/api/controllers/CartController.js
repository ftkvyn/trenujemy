// CartController


module.exports = {
	addItem: function (req, res){
	    if(!req.session.cart){
	    	req.session.cart = {
	    		totalItems:0
	    	};
	    }
	    console.log(req.body);
	    req.session.cart.totalItems ++;
	    res.redirect('/cart');
	},

	removeItem: function (req, res){
	    if(req.session.cart && req.session.cart.totalItems){
	    	req.session.cart.totalItems --;
	    }	    
	    res.redirect('/cart');
	}
}