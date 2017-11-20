/**
 * UsedDishComponent.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	dish:{
		model: 'Dish',
		required:true	
	},
	component:{
		model: 'DishComponent',
		required:true	
	},
	weight:{
		type:'integer',
		required: true
	}
  }
};

