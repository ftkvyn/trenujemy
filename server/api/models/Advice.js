/**
 * Advice.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const fields = ['protein','carbo','fat','fiber','sodium','potassium','calcium',
'iron','vitaminC','vitminA','calories'];

module.exports = {

  attributes: {
  	user:{
  		model:'User',
  		required: true,
  	},
    trainer:{
      model:'User',
      required: true
    },

  	protein:{
  		type:'number',columnType:'integer'
  	},

  	carbo:{
  		type:'number',columnType:'integer'
  	},

	  fat:{
  		type:'number',columnType:'integer'
  	},

    calories:{
      type:'number',columnType:'integer'
    },

  	// fiber:{ //g
  	// 	type:'number',columnType:'integer'
  	// },
  	// sodium:{ //mg
  	// 	type:'number',columnType:'integer'
  	// },
  	// potassium:{//mg
  	// 	type:'number',columnType:'integer'
  	// },
  	// calcium:{//mg
  	// 	type:'number',columnType:'integer'
  	// },
  	// iron:{//mg
  	// 	type:'number',columnType:'integer'
  	// },
  	// vitaminC:{//mg
  	// 	type:'number',columnType:'integer'
  	// },
  	// vitminA:{//ug
  	// 	type:'number',columnType:'integer'
  	// }, 	

  	// show_fiber:{
  	// 	type:'boolean',
  	// 	defaultsTo: false
  	// },
  	// show_sodium:{
  	// 	type:'boolean',
  	// 	defaultsTo: false
  	// },
  	// show_potassium:{
  	// 	type:'boolean',
  	// 	defaultsTo: false
  	// },
  	// show_calcium:{
  	// 	type:'boolean',
  	// 	defaultsTo: false
  	// },
  	// show_iron:{
  	// 	type:'boolean',
  	// 	defaultsTo: false
  	// },
  	// show_vitaminC:{
  	// 	type:'boolean',
  	// 	defaultsTo: false
  	// },
  	// show_vitminA:{
  	// 	type:'boolean',
  	// 	defaultsTo: false
  	// },

  	// sameInTrainingDays:{
  	// 	type:'boolean',
  	// 	defaultsTo: true
  	// },

  	plan:{
  		type:'string',columnType:'text'
  	},

    shouldSendEmail:{
      type:'boolean'
    },
  },

  beforeValidate: function (values, cb) {
    for (var i = fields.length - 1; i >= 0; i--) {
      const key = fields[i];
      if(!values[key]){
        delete values[key];
      }
    }
    cb();
  },
};

