const GLOBAL_STATE = require('../state');

function logUserDetails(params) {
  console.log('HERE?!');
  console.log('logUserDetails params:');
  console.log(params);
  console.log('- - - ');
}

function setConnected(val) {
  GLOBAL_STATE.MONGO_CONNECTED = val;
}

module.exports = {
  logUserDetails,
  setConnected,
};
