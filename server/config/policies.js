/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  '*': 'sessionAuth',

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	// RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
	// }
  AuthController:{
    '*':true,
    'adminImpersonate': 'isAdmin'
  },

  CartController:{
    'addItem': 'notTrainer',
    'removeItem':true,
    'payment': ['sessionAuthRedirectToLogin', 'notTrainer'],
    '*':'sessionAuthRedirectToLogin',
    'verify':true
  },

  ViewsController:{
    '*' : true,
    'dashboard' : 'sessionAuthRedirectToLogin',
    'cartApprove' : 'sessionAuthRedirectToLogin'
  },

  UserDataController:{
    '*': 'sessionAuth',
    'getClientsData': 'isTrainer',
    'getSurvey': 'isTrainerForOtherUser'
  },

  TrainerInfoController:{
    '*': 'isCurrentTrainerInfo',
    'updateRoute': 'isCurrentTrainerInfo',
    'approveByAdmin':'isImpersonatedAdmin',
    'find': 'sessionAuth',
    'findOne':'sessionAuth',
    'create':false,
    'destroy':false
  },

  FilesController:{
    '*': 'sessionAuth',
  },

  TrainPlacesController:{
    '*':'isTrainer',
    'find':true,
    'findOne':true,
  },

  // TrainTimesController:{
  //   '*':'isTrainer',
  //   'find':true,
  //   'findOne':true,
  // },

  TrainPlanController:{
    '*':'isTrainer',
    'update':'isTrainersTrainPlan',
    'find':true,
    'findOne':true,
  },

  // FeedPlanTargetController:{
  //   'find':true,
  //   'create':false,
  //   'destroy':false
  // },

  FeedPlanController:{
    'find':true,
    'update':'isTrainersFeedPlan',
    'create':false,
    'destroy':false
  },

  AdviceController:{
    'find':'sessionAuth',
    'findUserTrainers':'isUser',
    'create':false,
    'destroy':false,
    'update':'isTrainer',
    'getDefaultVals':'isTrainer'
  },

  DailyReportController:{
    'find':'isTrainerForOtherUser',    
    'create':false,
    'destroy':false,
    'update':'isTrainerForOtherUser',
    'getPastImages':'isTrainerForOtherUser',
    'saveBodySize':'sessionAuth'
  },

  UserRequirementController:{
    'find':'isTrainerForOtherUser',
    'create':false,
    'destroy':false,
    'update':'isTrainer',
  },

  DailyTrainingController:{
    'find':false,
    'create':false,
    'destroy':false,
    'updateOrCreate':'usersDay',
    'getTrainingTypes':'isTrainerForOtherUser'
  },

  DishController:{
    '*':false,
    'loadComponents': 'sessionAuth',
    'findDishes':'usersDayOrTrainer',
    'addComponent':'usersDay',
    'removeComponent':'usersDay',
    'saveDish':'usersDay',
    'loadUserPreferredComponents':'sessionAuth'
  },

  AdviseTemplateController:{
    '*':'isTrainer',
    'update': 'isTrainerAdviceTemplate',
    'destroy': 'isTrainerAdviceTemplate'
  },

  AnswerTemplateController:{
    '*':'isTrainer',
    'update': 'isTrainerAnswerTemplate',
    'destroy': 'isTrainerAnswerTemplate'
  },

  TrainerHintsController:{
    '*':'isTrainer',
    'userHints':'isTrainerForOtherUser'
  },

  NotificationsController:{
    '*':'sessionAuth',
    'create':false,
    'destroy': false
  },

  TransactionsController:{
    '*': false,
    'find':'isTrainer'
  },

  TrainingController:{
    '*':'isTrainer',
    'find':'isTrainerForOtherUser',
    'update':'sessionAuth'
  }
};
