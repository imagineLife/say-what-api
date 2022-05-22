const { MongoClient } = require('mongodb');
const { GLOBAL_STATE } = require('../global')
const { DB } = require('../models')

function makeConnectionString({
  username,
  pw,
  host,
  port,
  authDB
}){
  // Error Handling
  if(typeof host === 'undefined' ||
    typeof port === 'undefined'){
      console.log(`missing vars: host: ${host}, port: ${port}`)
      
      throw 'Cannot create db connection with missing param';
    }
  if(
    !process.env.MONGO_AUTH &&
    (!username ||
    !pw ||
    !authDB)
  ){
    console.log(`Expected auth connection to db`)
    throw 'Cannot create db connection with missing param';
  }

  // no auth?!
  if(process?.env?.MONGO_AUTH?.toString() === 'false'){
    return `mongodb://${host}:${port}/?connectTimeoutMS=2500`;
  }

  //auth'd
  return `mongodb://${username}:${pw}@${host}:${port}/?authSource=${authDB}`;
}

module.exports = {
  makeConnectionString,
  // setupStores,
  // setupCollection
}