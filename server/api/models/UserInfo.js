/**
 * UserInfo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	user:{
		model: 'User',
		required:true	
	},

	target:{
		type:'string',
		enum: ['weight', 'cut', 'slim', 'power']
	},

	bodyType:{
		type:'integer',
		enum: [1,2,3]
	},
  }
};
