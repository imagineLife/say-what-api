// dependencies
const chai = require('chai');
const chaiHttp= require('chai-http');
const { routes: { SPEECHES: { ROOT } } } = require('./../../../../global/constants');
const GLOBAL_STATE = require('./../../../../global/state')
const { startServer, stopServer, expressObj, setupDB } = require('./../../../../server-setup');
const { Crud } = require('../../../../models');
describe(`${ROOT}: GET`, function () {
  chai.use(chaiHttp);
  let localServerObj;
  let TestMongoClient;
  
  beforeAll(async function () {
    process.env.MONGO_AUTH = false;
    if (localServerObj && localServerObj.close) {
      await stopServer(localServerObj);
    }
    if (expressObj && expressObj.close) {
      await stopServer(expressObj);
    }
    localServerObj = await startServer(expressObj);

    const db_obj = {
      host: 'localhost',
      port: '27017',
    };
    TestMongoClient = await setupDB({ ...db_obj });

    TestSayWhat = TestMongoClient.registerDB('TestSayWhat');
    TestSpeechCollection = new Crud({
      db: TestSayWhat,
      collection: 'TestSpeeches',
    });
    GLOBAL_STATE.Collections.Speeches = TestSpeechCollection;
  });

  afterAll(async function () {
    if (localServerObj && localServerObj.close) {
      await stopServer(localServerObj);
    }
    if (expressObj && expressObj.close) {
      await stopServer(expressObj);
    }
    GLOBAL_STATE.Collections.Speeches = false;
    await TestMongoClient.close();
  });

  beforeEach(async function () {
    if (localServerObj && localServerObj.close) {
      await stopServer(localServerObj) 
    }
    if (expressObj && expressObj.close) { 
      await stopServer(expressObj)
    }
    localServerObj = await startServer(expressObj)
  });

  afterEach(async function () {
    if (localServerObj && localServerObj.close) {
      await stopServer(localServerObj) 
    }
    if (expressObj && expressObj.close) { 
      await stopServer(expressObj)
    }
  });

  describe('succeeds', () => { 
    it('returns 2 speeches after inserting 2 speeches', async () => { 
      let firstInsertedId, secondInsertedId;
      const mockOne = {
        orator: 'Test Talker',
        date: '14-23-2345',
        text: 'This is A Long Speech text blob that should be truncated by the api. Flannel chartreuse tacos craft beer asymmetrical cold-pressed. Seitan skateboard vinyl brooklyn occupy fingerstache four loko fam gluten-free franzen shaman poke keytar pour-over. Selfies copper mug chillwave migas pour-over, kale chips cornhole listicle la croix hella fanny pack kickstarter chartreuse. Pour-over church-key banjo hell of, jianbing affogato roof party. Retro chartreuse craft beer hexagon, 8-bit shaman fanny pack. Readymade kale chips squid chicharrones, keytar etsy tacos.',
        snippet:
          '...We will make America wealthy again. We will make America proud again. We will make America safe again, And yes, together, we will make we will make America great again.',
      };
      const mockTwo = {
        orator: 'Talker Two',
        date: '23-45-5499',
        text: 'This is A Long Speech text blob that should be truncated by the api. Tattooed synth keffiyeh mustache pork belly vaporware. Mustache distillery tbh, affogato succulents photo booth taiyaki iPhone. Pop-up hella paleo neutra tumeric. Banh mi craft beer migas shabby chic air plant, health goth heirloom fashion axe coloring book cold-pressed gluten-free taxidermy echo park. YOLO typewriter cornhole locavore pok pok meditation. Put a bird on it waistcoat pour-over lomo.',
      };
      const myArr = [mockOne, mockTwo];
      try {
        // insert
        const { insertedId: firstSpeechId } = await TestSpeechCollection.createOne(mockOne);
        const { insertedId: secondSpeechId } = await TestSpeechCollection.createOne(mockTwo);
        
        let { body } = await chai.request(localServerObj).get(ROOT);
        
        expect(typeof body).toBe('object')
        
        expect(body.length).toBe(2);

        body.forEach((itm, idx) => {          
          expect(itm.orator).toBe(myArr[idx].orator)
          expect(itm.date).toBe(myArr[idx].date);
          expect(itm.text).toBe(myArr[idx].text);
        })
      } catch (e) {
        throw new Error(e)
      } finally {
        await TestSpeechCollection.remove()
      }
    })
  })
  describe('fails', () => { 
    it('returns err when collection is not stored in global state', async () => {
      GLOBAL_STATE.Collections.Speeches = null;

      const res = await chai.request(localServerObj).get(ROOT);
      expect(res.status).toBe(500);
      expect(res.body.Error).toBe('get Speeches error');
    });
  })
});
