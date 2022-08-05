// dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  routes: {
    USERS: { ROOT, BY_ID },
  },
} = require('../../../../global/constants');
const {
  startServer,
  stopServer,
  expressObj,
  setupDB,
} = require('../../../../server-setup');
// const { MongoClient } = require('mongodb')
describe(`${ROOT}${BY_ID} - GET`, () => {
  chai.use(chaiHttp);
  let localServerObj;
  let TestMongoClient;
  beforeEach(async () => {
    process.env.MONGO_AUTH = false;
    if (localServerObj && localServerObj.close) {
      await stopServer(localServerObj);
    }
    if (expressObj && expressObj.close) {
      await stopServer(expressObj);
    }
    localServerObj = await startServer(expressObj);

    const dbObj = {
      host: 'localhost',
      port: '27017',
    };
    TestMongoClient = await setupDB({ ...dbObj });
  });

  afterEach(async () => {
    // await TestMongoClient.close()
    if (localServerObj && localServerObj.close) {
      await stopServer(localServerObj);
    }
    if (expressObj && expressObj.close) {
      await stopServer(expressObj);
    }
    await TestMongoClient.close();
  });

  const testIdParams = [987, 876, 765];
  it.each(testIdParams)(`returns text based on param %d`, async (paramVal) => {
    const fetchRoute = `${ROOT}/${paramVal}`;
    console.log('fetchRoute');
    console.log(fetchRoute);

    const res = await chai.request(localServerObj).get(fetchRoute);
    expect(res.body).toBe(`getById: ${paramVal}`);
  });
});
