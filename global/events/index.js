/*

  Dependencies

*/
const { EventEmitter } = require('events');
const {
  events: { LOG_USER_DEETS },
} = require('../constants');
const { logUserDetails, setConnected } = require('./handlers')

const ServicesEmitter = new EventEmitter();
ServicesEmitter.on('DB_DISCONNECT', setConnected);
ServicesEmitter.on('DB_CONNECT', setConnected);
ServicesEmitter.on(LOG_USER_DEETS, logUserDetails);
module.exports = {
  ServicesEmitter,
  setConnected,
};
