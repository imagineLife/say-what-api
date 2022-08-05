const GLOBAL_STATE = require('../state');
const { Collections } = require('../state');

async function logUserDetails(params) {
  try {
    await Collections.ServerLogs.createOne(params);
    return true;
  } catch (e) {
    console.warn(`logUserDetails Error: ${e.message}`);
    return `logUserDetails Error: ${e.message}`;
  }
}

function setConnected(val) {
  GLOBAL_STATE.MONGO_CONNECTED = val;
}

module.exports = {
  logUserDetails,
  setConnected,
};
