const { GLOBAL_STATE } = require('./../../global')

function checkForDbConnection(req,res,nxt){  
  const notDB = !req.path.match('^/db')
  const notHealthCheck = !req.path.match('^/health-check')
  const DB_NOT_CONNECTED = GLOBAL_STATE?.MONGO_CLIENT?.topology?.isConnected() !== true;
  if( notDB && notHealthCheck && DB_NOT_CONNECTED ){
    return res.status(500).send({Error: "Server Error, try again shortly"})
  }
  nxt()
}

module.exports = {
 checkForDbConnection 
}