module.exports = function(req, res, next) {

  if (!req.session.user) {
    return res.forbidden('You are not permitted to perform this action.');
  }

  DailyReport.findOne({id: req.params.dayId})
  .exec(function(err, dailyReport){
    if(err || !dailyReport){
      console.error(err);
      return res.forbidden('You are not permitted to perform this action.');    
    }
    if(dailyReport.user != req.session.user.id){
      return res.forbidden('You are not permitted to perform this action.');    
    }
    return next();  
  });  
};
