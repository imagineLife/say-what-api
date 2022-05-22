const GLOBAL_STATE = {
  MONGO_CONNECTED: false,   //used in checkForDbConnection middleware
  MONGO_CLIENT: null,
  DBS:{
    SayWhat: false
  },
  Collections: {
    Users: false,
    Speeches: false
  }
}

module.exports = GLOBAL_STATE;