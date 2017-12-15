/**
 * UserRequirement.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  		user:{
  			model:'User',
  			required: true,
  			unique:true
  		},

  		sendTips:{
  			type:'string',
  			enum: ['never', 'weekly', 'each_third_day', 
  			'each_second_day', 'each_day', 'twice_a_day'],
  			required:true,
  			defaultsTo:'never'
  		},

  		provideWeight:{
  			type:'string',
  			enum: ['never', 'monthly', 'each_second_week', 'weekly', 
  			'each_third_day', 
  			'each_second_day', 'each_day'],
  			required:true,
  			defaultsTo:'never'
  		},

  		provideSizes:{
  			type:'string',
  			enum: ['never', 'monthly', 'each_second_week', 'weekly', 
  			'each_third_day', 
  			'each_second_day', 'each_day'],
  			required:true,
  			defaultsTo:'never'
  		},

  		providePhoto:{
  			type:'string',
  			enum: ['never', 'monthly', 'each_second_week', 'weekly', 
  			'each_third_day', 
  			'each_second_day', 'each_day'],
  			required:true,
  			defaultsTo:'never'
  		},

  		provideMedicalSurvey:{
  			type:'boolean',
  		},
  }
};

