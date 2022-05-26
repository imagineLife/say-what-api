// Dependencies
const { twoAreEqual } = require('./helpers');
const { expressObj, startServer, setupDB } = require('./server-setup');
const { Crud } = require('./models');
const {
  db: {
    NAME: DB_NAME,
    collections: { USERS, SERVER_LOGS },
  },
} = require('./global/constants');
const globalContent = require('./global');

async function startApi() {
  try {
    if (!process.env.DB || process.env.DB === true) {
      const dbObj = {
        username: process.env.MONGO_DB_USER,
        pw: process.env.MONGO_DB_PW,
        host: process.env.MONGO_DB_HOST,
        port: process.env.MONGO_DB_PORT,
        authDB: process.env.MONGO_DB_AUTH_DB,
      };
      const SayWhatMongoClient = await setupDB({ ...dbObj });
      const sayWhatDB = SayWhatMongoClient.registerDB(
        process.env.DB_NAME || DB_NAME
      );

      /* 
        Register Collections 
        - Users
        - client
      */

      const ServerLogsCollection = new Crud({
        db: sayWhatDB,
        collection: SERVER_LOGS,
      });
      
      globalContent.GLOBAL_STATE.Collections.ServerLogs = ServerLogsCollection;
      
      const UsersCollection = new Crud({
        db: sayWhatDB,
        collection: USERS,
      });

      globalContent.GLOBAL_STATE.Collections.Users = UsersCollection;
      
    }

    startServer(expressObj);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

if (twoAreEqual(require.main, module)) {
  startApi();
}

module.exports = {
  startServer,
  startApi,
};
