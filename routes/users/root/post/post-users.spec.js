const chai = require('chai');
const chaiHttp = require('chai-http');
const { expectMissingParams } = require('./../../../../lib');
const postUsers = require('./');
const { Crud } = require('../../../../models');
const { setupDB, startServer, stopServer, expressObj } = require('./../../../../server-setup');

const {
  GLOBAL_STATE: { Collections },
  routes,
} = require('./../../../../global');

describe('Users POST handler', () => {
  chai.use(chaiHttp);
  let localServerObj;

  const COLL_NAME = 'TestUsers';
  const DB_NAME = 'TestSayWhat';
  let TestMongoClient;
  let TestSayWhat;
  let TestUserCollection;
  

  beforeAll(async () => {
    process.env.MONGO_AUTH = false;
    const db_obj = {
      host: 'localhost',
      port: '27017',
    };
    TestMongoClient = await setupDB({ ...db_obj });
    TestSayWhat = TestMongoClient.registerDB(DB_NAME);
    TestUserCollection = new Crud({
      db: TestSayWhat,
      collection: COLL_NAME,
    });
    Collections.Users = TestUserCollection;

    // may need to be beforeEach
    if (localServerObj && localServerObj.close) {
      await stopServer(localServerObj);
    }
    if (expressObj && expressObj.close) {
      await stopServer(expressObj);
    }
    localServerObj = await startServer(expressObj);
  });

  afterAll(async () => {
    // await TestUserCollection.remove();
    Collections.Users = null;
    await TestMongoClient.close();

    if (localServerObj && localServerObj.close) {
      await stopServer(localServerObj);
    }
    if (expressObj && expressObj.close) {
      await stopServer(expressObj);
    }
  });

  describe('fails when', () => {
    it('no request body', async () => {
      const res = await chai.request(localServerObj).post(routes.USERS.ROOT);
      expectMissingParams(res)
    });
    it('missing email address', async () => {
      const res = await chai.request(localServerObj).post(routes.USERS.ROOT).send({first: 'Joe'});
      expectMissingParams(res)
    });
   it('missing first address', async () => {
     const res = await chai
       .request(localServerObj)
       .post(routes.USERS.ROOT)
       .set('content-type', 'application/json')
       .send({ email: 'walker@texas.ranger' });
     expectMissingParams(res);
   });
  });

  it('succeeds', async () => {
    const EMAIL = 'test@email.address';
    const FIRST = 'mockFirstName';
    const res = await chai.request(localServerObj).post(routes.USERS.ROOT).send({email: EMAIL, first: FIRST});
    const { body, status } = res
    expect(status).toBe(200);
    expect(JSON.stringify(body)).toBe(JSON.stringify({works: 'qwer'}));
  })
    
  it('ERROR when db is disconnected', async () => { 
    const FAILABLE_EMAIL = 'failable@email.address';
    const FIRST = 'mockFirstName';
    await TestUserCollection.deleteOne({ id: FAILABLE_EMAIL });
    
    // trigger an error with no global User val
    Collections.Users = null;

    // try {
    const res = await chai
      .request(localServerObj)
      .post(routes.USERS.ROOT)
      .send({ email: FAILABLE_EMAIL, first: FIRST });
    expect(res.status).toBe(500)
    expect(res.body.Error).toBe('postUsers error');  
  })
});
