const { MongoClient } = require('mongodb');
const { GLOBAL_STATE } = require('../../global');

class DB {
  constructor({ connectionObj }) {
    this.connectionObj = connectionObj;
    this.client = null;
    this.db = null;
  }

  /*
    takes db connection obj
      username
      pw
      host
      port
      authDB
    returns the client

    TODO: if multiple db connections get introduced,
      update GLOBAL_STATE.MONGO_CLIENT to be more accommodating
  */
  async connect() {
    try {
      // Connect
      // eslint-disable-next-line global-require
      const uriStr = require('../../database').makeConnectionString(
        this.connectionObj
      );
      this.client = new MongoClient(uriStr);
      await this.client.connect();

      // store
      GLOBAL_STATE.MONGO_CONNECTED = true;
      GLOBAL_STATE.MONGO_CLIENT = this.client;
      console.log(
        `SERVER: Connected to mongo db on ${this.connectionObj.host}:${this.connectionObj.port}`
      );

      return this.client;
    } catch (e) {
      console.log(`DB Class connect method error:`);
      console.log(e);
      throw new Error(e);
    }
  }

  async close() {
    await this.client.close();
    console.log(
      `CLOSED db connection on ${this.connectionObj.host}:${this.connectionObj.port}`
    );
  }

  // Create a new Db instance sharing the current socket connections
  // assigns the db to "this.db"
  // returns the db object for use with working with collections in the db in the Crud model
  // DOCS: https://mongodb.github.io/node-mongodb-native/4.4/classes/MongoClient.html#db
  registerDB(dbName) {
    /*
      error-handling
    */
    if (!this.client) {
      throw new Error(
        'attempted to registerDB without building a client: use setupDB or "new DB()" to connect to a mongo instance'
      );
    }
    if (!dbName) {
      throw new Error('missing db name string param');
    }

    this.db = this.client.db(dbName);
    return this.db;
  }

  async getAndLogDBs() {
    const databasesList = await this.client.db().admin().listDatabases();
    const { databases } = databasesList;
    console.table(databases);
    return databases;
  }
}

module.exports = {
  DB,
};
