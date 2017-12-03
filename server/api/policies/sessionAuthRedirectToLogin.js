module.exports = function(req, res, next) {

  if (req.session.user) {
    return next();
  }
  var returnUrl = encodeURIComponent(req.url);
  return res.redirect('/login?returnUrl=' + returnUrl);
};
