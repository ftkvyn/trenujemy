/**
 * SurveySettngs.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  		settingType:{
  			type:'string',
  			enum: ['training', 'feed'],
  			required: true,	
  			unique: true,
  		},
  		includedFields:{
  			type: 'array',
  		}
  },

  beforeUpdate: function (values, cb) {
    SurveySettngs.findOne({id: values.id})
    .exec(function(err, oldItem){
      cb();  
      try{
        if(oldItem){
          let query = null;
          if(values.includedFields && values.includedFields.length && 
              oldItem.includedFields && (oldItem.includedFields.length < values.includedFields.length)){
            if(oldItem.settingType == 'training'){
              query = FeedPlanPurchase.find({isActive: true});
            }else if(oldItem.settingType == 'feed'){
              query = TrainPlanPurchase.find({isActive: true});
            }
            query.exec(function(err, items){
              let userIds = items.map( item => item.user);
              Notifications.update({user: userIds},{updateSurvey: true})
              .exec(function(){});
            });
          }
        }
      }
      catch(ex){
        console.error(ex);
      }
    });    
  }
};

