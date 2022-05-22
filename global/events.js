/*

  Dependencies

*/ 
const { EventEmitter } = require("events");
const GLOBAL_STATE = require('./state');

function setConnected(val){
  GLOBAL_STATE.MONGO_CONNECTED = val;
}
const ServicesEmitter = new EventEmitter()
ServicesEmitter.on('DB_DISCONNECT', setConnected)
ServicesEmitter.on('DB_CONNECT', setConnected)

module.exports = {
  ServicesEmitter,
  setConnected
};