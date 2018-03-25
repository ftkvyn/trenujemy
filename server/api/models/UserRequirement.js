/**
 * UserRequirement.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const hintPeriods = hintsService.hintPeriods;

module.exports = {

  attributes: {
  		user:{
  			model:'User',
  			required: true,
  			unique:true
  		},

  		sendTips:{
  			type:'string',
        enum: hintPeriods,
  			required:true,
  			defaultsTo:'never'
  		}
  }
};

