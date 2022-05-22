const GLOBAL_STATE = require('./state')
const ServicesEmitter = require('./events');
const CONSTANTS = require('./constants')
module.exports = { 
  GLOBAL_STATE,
  ServicesEmitter,
  routes: CONSTANTS.routes
}