module.exports = function(req, res, next) {

  if(req.session.user && req.session.user.role == 'trainer'){
    cartService.initCart(req, true);
    req.session.cartMessage = 'Nie możesz dokonywać zakupów jako trener';
    return res.redirect('/cart'); 
  }

  return next();
};
