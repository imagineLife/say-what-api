const { ServicesEmitter } = require('./../../global/events')
const GLOBAL_STATE = require('./../../global/state');
async function restartHandler(req, res) {
  try {
    await GLOBAL_STATE.MONGO_CLIENT.connect()
    ServicesEmitter.emit('DB_CONNECT', true)
    res.status(200).send({ MONGO_CONNECTED: GLOBAL_STATE.MONGO_CLIENT.topology.s.state === 'connected' })
  } catch (e) { 
    console.log(`restart handler err:`)
    console.log(e)
    res.status(500).send({Error: 'server error'})
  }
}

module.exports = restartHandler;