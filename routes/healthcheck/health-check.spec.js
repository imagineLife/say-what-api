// dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const { routes: { HEALTH_CHECK } } = require('./../../global/constants');
const { startServer, stopServer, expressObj, setupDB } = require('./../../server-setup');

describe(HEALTH_CHECK, function () {
  chai.use(chaiHttp);
  let localServerObj;

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

  it('get returns "server is up & running!"', async function () {
    const res = await chai.request(localServerObj).get(HEALTH_CHECK);
    expect(res.text).toBe("server is up & running!");
  });
});
