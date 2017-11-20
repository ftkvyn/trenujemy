/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	login: {
	    type: 'string',
	    unique: true,
	    required: true
	},
	role:{
		type:'string',
		enum: ['user', 'trainer']
	},
	password: {
	    type: 'string',
	    required: true	    
	},
	profilePic:{
		type:'url'
	},
	passwordRecoveryKey: {
	    type: 'string'	    
	},
	name:{
		type:'string'
	},
	email:{
		type:'string'
	},
	phone:{
		type:'string'
	},
	birthday:{
		type:'datetime'
	},
  }
};

