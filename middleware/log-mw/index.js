const { ServicesEmitter } = require('../../global/events');
const {
  events: { LOG_USER_DEETS },
} = require('../../global/constants');

/*
  middleware intended to log "user details" by passing details to the global service emitter
  - the requester url
  - the date
  - the url path
*/
module.exports = function logMW(req, res, nxt) {
  const logObj = {
    ip: req.socket.remoteAddress,
    date: new Date().toUTCString(),
    path: req.path,
  };
  ServicesEmitter.emit(LOG_USER_DEETS, logObj);
  nxt();
};
