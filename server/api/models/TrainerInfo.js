/**
 * TrainerInfo.js
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
	friendlyId:{
		type:'text',
		required: true,
		unique: true
	},
	invoiceInfo:{
		type:'string',columnType:'text'
	},
	sendHints:{
		type:'boolean'
	},
	isActivatedByTrainer:{
		type:'boolean'
	},
	isApprovedByAdmin:{
		type:'boolean'
	},
	city:{
		type:'number',columnType:'integer',
		isIn: [0,1,2,3,4,5,6,7]
		//0-Not set, 1-Warszawa, 2-Kraków, 3-Łódź, 4-Wrocław, 5-Poznań, 6-Gdańsk, 7-Szczecin
		//int for faster search
	}
  }
};

