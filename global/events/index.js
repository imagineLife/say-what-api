/*

  Dependencies

*/
const { EventEmitter } = require('events');
const GLOBAL_STATE = require('../state');
const {
  events: { LOG_USER_DEETS },
} = require('../constants');

function setConnected(val) {
  GLOBAL_STATE.MONGO_CONNECTED = val;
}

function logUserDetails(params) {
  console.log('HERE?!');
  console.log('logUserDetails params:');
  console.log(params);
  console.log('- - - ');
}

const ServicesEmitter = new EventEmitter();
ServicesEmitter.on('DB_DISCONNECT', setConnected);
ServicesEmitter.on('DB_CONNECT', setConnected);
ServicesEmitter.on(LOG_USER_DEETS, logUserDetails);
module.exports = {
  ServicesEmitter,
  setConnected,
};
