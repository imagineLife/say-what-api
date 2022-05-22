const { expressObj } = require('./express');
const { 
  startServer,
  stopServer,
  logIfTrue,
  setupDB
} = require('./setup-fns')

  module.exports = {
    expressObj,
    startServer,
    stopServer,
    logIfTrue,
    setupDB
  }