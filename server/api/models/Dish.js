/**
 * Dish.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    dailyReport:{
      model:'DailyReport',
      required: true
    },
  	components:{
  		collection:'DishComponent',
  		via:'dish'
  	},
    hour:{
      type:'number',columnType:'integer',
      //required: true,
      //defaultsTo: 730, //For 7:30
    },  	
    comment:{
      type:'string',columnType:'text'
    }
  }
};

