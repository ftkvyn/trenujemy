/**
 * UserHints.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	user:{
  		model:'User',
  		required: true,
  	},

  	hint:{
  		model:'TrainerHints'
  	},

  	text:{
  		type:'text',
  		required:true
  	},

    isRead:{
      type:'boolean'
    }
  }
};

