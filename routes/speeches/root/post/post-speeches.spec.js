// dependencies
const chai = require('chai');
const chaiHttp= require('chai-http');
const { routes: { SPEECHES: { ROOT } } } = require('./../../../../global/constants');
const { GLOBAL_STATE: { Collections } } = require('./../../../../global');
const { startServer, stopServer, expressObj, setupDB } = require('./../../../../server-setup');
const { Crud } = require('./../../../../models');
describe(`${ROOT}: POST`, function () {
  chai.use(chaiHttp);
  let localServerObj;
  let TestMongoClient;
  let TestSpeechesCollection;
  const DB_NAME = 'TestSayWhat';
  const COLL_NAME = 'TestPostSpeeches';
  
  
  beforeAll(async () => { 
    process.env.MONGO_AUTH = false;
    const db_obj = {
      host: 'localhost',
      port: '27017'
    }
    TestMongoClient = await setupDB({ ...db_obj });
     if (localServerObj && localServerObj.close) {
       await stopServer(localServerObj);
     }
     if (expressObj && expressObj.close) {
       await stopServer(expressObj);
     }
    localServerObj = await startServer(expressObj);
    TestSayWhat = TestMongoClient.registerDB(DB_NAME);
    TestSpeechesCollection = new Crud({ db: TestSayWhat, collection: COLL_NAME });
    Collections.Speeches = TestSpeechesCollection;
  })

  afterAll(async () => { 
    await TestSpeechesCollection.remove();
    Collections.Speeches = null;
    await TestMongoClient.close()
    if (localServerObj && localServerObj.close) {
      await stopServer(localServerObj);
    }
    if (expressObj && expressObj.close) {
      await stopServer(expressObj);
    }
  })

  describe('fails', () => { 
    describe('without expected params', () => { 
      it('no orator', async () => { 
        const res = await chai.request(localServerObj).post(`${ROOT}`).send({
          date: '1234',
          text: 'qwer'
        });
        expect(res.status).toBe(422);
        expect(JSON.stringify(res.body)).toBe(JSON.stringify({ Error: 'missing required params' }));
      })
      it('no date', async () => {
        const res = await chai.request(localServerObj).post(`${ROOT}`).send({
          orator: '1234',
          text: 'qwer',
        });
        expect(res.status).toBe(422);
        expect(JSON.stringify(res.body)).toBe(JSON.stringify({ Error: 'missing required params' }));
      });
      it('no text', async () => {
        const res = await chai.request(localServerObj).post(`${ROOT}`).send({
          orator: '1234',
          date: 'qwer',
        });
        expect(res.status).toBe(422);
        expect(JSON.stringify(res.body)).toBe(JSON.stringify({ Error: 'missing required params' }));
      });
    })
  })
  describe('succeeds', () => { 
    it(`returns 200 & success body`, async () => {
      const res = await chai.request(localServerObj).post(`${ROOT}`).send({
        orator: '1234',
        date: 'qwer',
        text: '1234'
      });
      expect(res.status).toBe(200)
      expect(res.body).toBe('success');
    });
  })

  describe('Errors', () => { 
    it('when collection is not stored in global state', async () => {
      await TestSpeechesCollection.createOne({ horse: 'dog' });

      // trigger an error with no global User val
      Collections.Speeches = null;

      // try {
      const res = await chai.request(localServerObj).post(`${ROOT}`).send({
        orator: '1234',
        date: 'qwer',
        text: '1234',
      });
      expect(res.status).toBe(500);
      expect(res.body.Error).toBe('Server error');
    });
  })
});
