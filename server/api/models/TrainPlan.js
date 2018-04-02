/**
 * TrainPlan.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      trainer:{
        model:'User',
        required: true
      },
  		name:{
  			type:'string'
  		},

  		priceOld:{
  			type:'number',columnType:'integer',
  		},

  		price:{
  			type:'number',columnType:'integer',
  		},

      trainsCount:{
        type:'number',columnType:'integer',
      },

  		description:{
  			type:'string',columnType:'text',
  		},

  		isActive:{
  			type:'boolean'
  		},

  		isRecomended:{
  			type:'boolean'
  		}
  },

  beforeValidate: function (values, cb) {
    if(!values.priceOld){
      delete values.priceOld;
    }
    cb();
  }
};

