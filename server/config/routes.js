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

  '/history': 'ViewsController.history',

  '/training': 'ViewsController.training',

  '/plans': 'ViewsController.plans',

  '/cart': 'ViewsController.cart',

  '/login': 'ViewsController.login',

  '/recoverPassword': 'ViewsController.recoverPassword',

  '/changePassword': 'ViewsController.changePassword',

  '/activate': 'ViewsController.activate',  

  '/dashboard/:path?/:path2?/:path3?': 'ViewsController.dashboard',

  'post /auth/login': 'AuthController.login',

  'get /auth/activate': 'AuthController.activate',

  'post /auth/register': 'AuthController.register',

  'get /auth/logout': 'AuthController.logout',

  'post /auth/login': 'AuthController.login',

  'post /auth/recoverPassword': 'AuthController.recoverPassword',

  'post /auth/changePassword': 'AuthController.changePassword',

  'get /api/userData' : 'UserDataController.getUserData',

  'post /api/userData' : 'UserDataController.saveUserData',

  'get /api/clients': 'UserDataController.getClientsData',

  'post /api/uploadImage': 'FilesController.uploadImage',

  'post /api/uploadFile': 'FilesController.uploadFile',

  'get /api/survey/:userId?' : 'UserDataController.getSurvey',

  'post /api/survey' : 'UserDataController.saveSurvey',

  'get /api/surveyFileLink/:id' : 'UserDataController.getSurveyFileLink',

  'get /api/trainPlansAll' : 'TrainPlanController.findAll',

  'get /api/defaultAdvice' : 'AdviceController.getDefaultVals',

  'get /api/advice/:userId?' : 'AdviceController.find',
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
