/**
 * THIS FILE WAS ADDED AUTOMATICALLY by the Sails 1.0 app migration tool.
 */

(function setEnv(){
  require('dotenv').config();
 })();

  
var cs = process.env.TRENUJEMY_DATABASE_URL;
var MYSQL_HOST = cs.substring(32,32+27);
var MYSQL_USER = cs.substring(8,8+14);
var MYSQL_PASS = cs.substring(23,23+8);
var MYSQL_DB   = cs.substring(60,60+22);

module.exports.datastores = {

  // In previous versions, datastores (then called 'connections') would only be loaded
  // if a model was actually using them.  Starting with Sails 1.0, _all_ configured
  // datastores will be loaded, regardless of use.  So we'll only include datastores in
  // this file that were actually being used.  Your original `connections` config is
  // still available as `config/connections-old.js.txt`.

  'mysqlServer': {
    adapter: 'sails-mysql',
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DB,
    reconnect: true,
    timezone: 'utc',
    connectionLimit: 5,
    pool: true
  }

};
