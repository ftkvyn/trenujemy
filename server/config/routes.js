/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': 'ViewsController.home',

  '/cart': 'ViewsController.cart',

  '/cartApprove': 'ViewsController.cartApprove',

  '/paymentEnd': 'ViewsController.paymentEnd',  

  'post /addItemToCart': 'CartController.addItem',

  'post /removeItemFromCart': 'CartController.removeItem',

  '/payment': 'CartController.payment',

  '/verify': 'CartController.verify',

  '/login': 'ViewsController.login',

  '/registerTrainer': 'ViewsController.registerTrainer',  

  '/recoverPassword': 'ViewsController.recoverPassword',

  '/changePassword': 'ViewsController.changePassword',

  '/activate': 'ViewsController.activate',  

  '/dashboard/:path?/:path2?/:path3?/:path4?/:path5?/:path6?/:path7?/:path8?': 'ViewsController.dashboard',

  'post /auth/login': 'AuthController.login',

  'get /auth/activate': 'AuthController.activate',

  'post /auth/register': 'AuthController.register',

  'post /auth/registerTrainer': 'AuthController.registerTrainer',  

  'get /auth/logout': 'AuthController.logout',

  'post /auth/login': 'AuthController.login',

  'post /auth/recoverPassword': 'AuthController.recoverPassword',

  'post /auth/changePassword': 'AuthController.changePassword',

  'get /api/userData/:userId?' : 'UserDataController.getUserData',

  'post /api/contact' : 'ViewsController.contact',

  'get /api/userPurchases/:userId?' : 'UserDataController.getUserPurchases',  

  'post /api/userData' : 'UserDataController.saveUserData',

  'post /api/userEmail' : 'UserDataController.saveUserEmail',

  'get /api/clients': 'UserDataController.getClientsData',

  'post /api/uploadImage': 'FilesController.uploadImage',

  'post /api/uploadFile': 'FilesController.uploadFile',

  'get /api/survey/:userId?' : 'UserDataController.getSurvey',

  'post /api/survey' : 'UserDataController.saveSurvey',

  'get /api/surveyFileLink/:id' : 'UserDataController.getSurveyFileLink',

  'get /api/trainPlansAll' : 'TrainPlanController.findAll',

  'get /api/defaultAdvice' : 'AdviceController.getDefaultVals',

  'get /api/advice/:userId?' : 'AdviceController.find',

  'get /api/userRequirement/:userId?' : 'UserRequirementController.find',

  'get /api/diary/:date/:userId?' : 'DailyReportController.find',

  'post /api/diary/:dayId/:userId?' : 'DailyReportController.update',

  'post /api/dailyTraining/:dayId' : 'DailyTrainingController.updateOrCreate',

  'post /api/dayTypes/:userId?' : 'DailyTrainingController.getTrainingTypes',

  'post /api/dailyBodySize' : 'DailyReportController.saveBodySize',

  'get /api/pastBodyImages/:date/:userId?' : 'DailyReportController.getPastImages',

  'get /api/dishes/:dayId' : 'DishController.findDishes',

  'post /api/dish/addComponent/:dayId' : 'DishController.addComponent',

  'post /api/dish/removeComponent/:dayId' : 'DishController.removeComponent', 

  'post /api/dishes/:dayId'  : 'DishController.saveDish',

  'get /api/dishComponents' : 'DishController.loadComponents',

  'get /api/preferredDishComponents' : 'DishController.loadUserPreferredComponents',  

  'get /api/hints/:userId?' : 'TrainerHintsController.userHints',

  'get /api/sendTrainerHints' : 'TrainerHintsController.getSendHints',

  'post /api/sendTrainerHints' : 'TrainerHintsController.saveSendHints',

  'get /api/notifications/hints' : 'NotificationsController.hints',

  'get /api/transactions/:year/:month' : 'TransactionsController.find',

  'get /api/training/:userId?': 'TrainingController.find',

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
