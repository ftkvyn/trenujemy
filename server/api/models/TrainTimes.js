/**
 * TrainTimes.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	dayOfWeek:{
  		type:'integer',
  		enum:[1,2,3,4,5,6,7],
  		required: true,
      unique: true
  	},
  	fromTime:{
  		type:'integer',
  		required: true
  	},
  	toTime:{
  		type:'integer',
  		required: true
  	}
  }
};

