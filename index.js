//Dependencies
const { twoAreEqual } = require('./helpers')
const { expressObj, startServer, setupDB } = require('./server-setup')
const { Crud } = require('./models')
const { ServicesEmitter } = require('./global')
const {
  db: {
    NAME: DB_NAME,
    collections: { USERS },
  },
} = require('./global/constants')
let globalContent = require('./global')
async function startApi() {
  try {
    if (!process.env.DB || process.env.DB === true) {
      const db_obj = {
        username: process.env.MONGO_DB_USER,
        pw: process.env.MONGO_DB_PW,
        host: process.env.MONGO_DB_HOST,
        port: process.env.MONGO_DB_PORT,
        authDB: process.env.MONGO_DB_AUTH_DB,
      }
      let SayWhatMongoClient = await setupDB({ ...db_obj })
      let sayWhatDB = SayWhatMongoClient.registerDB(
        process.env.DB_NAME || DB_NAME
      )

      /* 
        Register Collections 
        - Users
      */

      let UsersCollection = new Crud({
        db: sayWhatDB,
        collection: USERS,
      })

      globalContent.GLOBAL_STATE.Collections.Users = UsersCollection
    }

    startServer(expressObj)
  } catch (e) {
    console.log(e)
  }
}

if (twoAreEqual(require.main, module)) {
  startApi()
}

module.exports = {
  startServer,
  startApi,
}
