const { ServicesEmitter } = require("../../global/events");
const { LOG_USER_DEETS } = require('../../global/constants');

module.exports = function logMW(req, res, nxt) {  
  const logObj = {
    ip: req?.headers? req.headers['x-forwarded-for'] : req.socket.remoteAddress
  };
  ServicesEmitter.emit(LOG_USER_DEETS, logObj);
  nxt()
}