const { twoAreEqual } = require('./../helpers')
const { DB } = require('./../models');
const { GLOBAL_STATE } = require('./../global')

const PORT = process.env.PORT || 3000;
console.log('----startup env vars----')
console.table({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT
})

function logIfTrue(a,b, logString){
  if (twoAreEqual(a,b)) {
    console.log(logString)
  }
}
async function stopServer(srvr){
  console.log('CLOSING SERVER')  
  return await srvr.close(logIfTrue(require.main, module, 'HTTP Graceful Shutdown'))
}

async function startServer(srvr){
  process.on('SIGTERM', () => {
    stopServer(srvr)
  })

  return srvr.listen(PORT, () => {
    console.log(`SERVER: http server listening on ${PORT}`)
  })
}

/*
  - takes a db name (string)
    - builds Mongo Client
    - connects mongo client
  - returns the db object
*/
async function setupDB(params) {
  try {
    // Connect
    const MongoClient = new DB({
      connectionObj: {
        host: params.host,
        port: params.port
      }
    })
    await MongoClient.connect()
    return MongoClient;
  } catch (e) {
    console.log(`setupDB fn error:`)
    console.log(e);
  }
}

module.exports = {
  startServer,
  stopServer,
  logIfTrue,
  setupDB
}