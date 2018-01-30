/**
 * SurveySettngs.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  		settingType:{
  			type:'string',
  			enum: ['training', 'feed'],
  			required: true,	
  			unique: true,
  		},
  		includedFields:{
  			type: 'array',
  		}
  }
};

