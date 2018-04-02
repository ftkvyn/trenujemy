/**
 * FeedPlan.js
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
  		months:{
  			type:'number',columnType:'integer',
  			required: true
  		},

  		isWithConsulting:{
  			type:'boolean'
  		},

  		isVisible:{
  			type:'boolean'
  		},

  		priceOld:{
  			type:'number',columnType:'integer',
  		},

  		price:{
  			type:'number',columnType:'integer',
  		},
  },

  beforeValidate: function (values, cb) {
    if(typeof values.priceOld == 'undefined' || values.priceOld === '' || isNaN(values.priceOld)){
      values.priceOld = null;
    }
    if(typeof values.price == 'undefined' || values.price === '' || isNaN(values.price)){
      values.price = null;
    }
    cb();
  }
};

