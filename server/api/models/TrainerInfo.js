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
		type:'string',
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
    activatedAt:{
        type: 'ref', columnType: 'datetime',
    },
	city:{
		type:'number',columnType:'integer',
		isIn: [0,1,2,3,4,5,6,7]
		//0-Not set, 1-Warszawa, 2-Kraków, 3-Łódź, 4-Wrocław, 5-Poznań, 6-Gdańsk, 7-Szczecin
		//int for faster search
	},

    isTrainer:{
        type:'boolean'
    },
    isFeedCounsultant:{
        type:'boolean'
    },

	mainText:{
		type:'string',columnType:'text'
	},

	certificates:{
      type: 'json'//, columnType: 'array' 
    },
    certificateImages:{
      type: 'json'//, columnType: 'array' 
    },
    achivements:{
      type: 'json'//, columnType: 'array' 
    },
    photos:{
      type: 'json'//, columnType: 'array' 
    },

    trainPlaces:{
      type: 'json'//, columnType: 'array' 
    },

    //====== trainingSpecialization ======//
    isTrainFitness:{
    	type:'boolean'
    },
    isTrainLifting:{
    	type:'boolean'
    },
    isTrainSwimming:{
    	type:'boolean'
    },
    isTrainFighting:{
    	type:'boolean'
    },
    isTrainBike:{
    	type:'boolean'
    },
    isTrainYoga:{
    	type:'boolean'
    },

    //====== trainingHelp ======//
    
    isTrainHelpLessWeight:{
    	type:'boolean'
    },
    isTrainHelpHealthImprove:{
    	type:'boolean'
    },
    isTrainHelpRehabilitation:{
    	type:'boolean'
    },
    isTrainHelpFixWeight:{
    	type:'boolean'
    },
    isTrainHelpFixShape:{
    	type:'boolean'
    },
    isTrainHelpSportResults:{
    	type:'boolean'
    },

    //====== feedSpecialization ======//

    isFeedBalance:{
    	type:'boolean'
    },
    isFeedWege:{
    	type:'boolean'
    },
    isFeedProtein:{
    	type:'boolean'
    },
    isFeedFat:{
    	type:'boolean'
    },
    isFeedAlkalising:{
    	type:'boolean'
    },
    isFeedCleaning:{
    	type:'boolean'
    },

    //====== feedHelp ======//

    isFeedHelpLessWeight:{
    	type:'boolean'
    },
    isFeedHelpHealthImprove:{
    	type:'boolean'
    },
    isFeedHelpRehabilitation:{
    	type:'boolean'
    },
    isFeedHelpFixWeight:{
    	type:'boolean'
    },
    isFeedHelpFixShape:{
    	type:'boolean'
    },
    isFeedHelpSportResults:{
    	type:'boolean'
    },

    isFreeTrainingEnabled:{
		type:'boolean'
	},
  }
};

