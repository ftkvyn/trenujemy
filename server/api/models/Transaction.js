/**
 * Transaction.js
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

	trainer:{
        model:'User',
        required: true
    },	

	item:{
		type:'json',
		required: true
	},

	title:{
		type:'string'
	},

	amount:{ // PLN * 100
		type:'number',columnType:'integer',
		required: true
	},

	externalId:{
		type:'string',
		required: true
	},

	status:{
		type:'string',
		required: true
	},

	errorMessage:{
		type:'string',
	}

  }
};

