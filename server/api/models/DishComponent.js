/**
 * DishComponent.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	name:{
  		type:'string',
  		required: true
  	},
    dish:{
      type:'Dish',
      required: true
    },
    weight:{
      type:'float'
    },
  	protein:{
  		type:'float'
  	},
  	fat:{
  		type:'float'
  	},
  	carbohydrate:{
  		type:'float'
  	},
  	calories:{
  		type:'float'
  	},
  }
};

