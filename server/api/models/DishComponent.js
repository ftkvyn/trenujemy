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
      model:'Dish',
      required: true
    },
    weight:{
      type:'number',columnType:'float'
    },
  	protein:{
  		type:'number',columnType:'float'
  	},
  	fat:{
  		type:'number',columnType:'float'
  	},
  	carbohydrate:{
  		type:'number',columnType:'float'
  	},
  	calories:{
  		type:'number',columnType:'float'
  	},

    sodium:{
      type:'number',columnType:'float'
    },
    potassium:{
      type:'number',columnType:'float'
    },
    calcium:{
      type:'number',columnType:'float'
    },
    iron:{
      type:'number',columnType:'float'
    },
    vitaminC:{
      type:'number',columnType:'float'
    },
    vitaminA:{
      type:'number',columnType:'float'
    },
    fiber:{
      type:'number',columnType:'float'
    },
  }
};