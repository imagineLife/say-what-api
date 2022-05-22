const { ServicesEmitter } = require('./../../global/events')
const GLOBAL_STATE = require('./../../global/state');

async function killHandler(req,res,nxt){
  ServicesEmitter.emit('DB_DISCONNECT', false)
  await GLOBAL_STATE.MONGO_CLIENT.topology.close()
  res.status(200).send({MONGO_CONNECTED: GLOBAL_STATE.MONGO_CLIENT.topology.isConnected()})
}

module.exports = killHandler;