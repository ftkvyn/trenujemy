/**
 * FeedPlan.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  		months:{
  			type:'integer',
  			required: true
  		},

  		isWithConsulting:{
  			type:'boolean'
  		},

  		isVisible:{
  			type:'boolean'
  		},

  		priceOld:{
  			type: 'integer',
  		},

  		price:{
  			type:'integer',
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

