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
  }
};

