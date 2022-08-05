// dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  routes: { HEALTH_CHECK },
} = require('../../global/constants');
const { startServer, stopServer, expressObj } = require('../../server-setup');

describe(HEALTH_CHECK, () => {
  chai.use(chaiHttp);
  let localServerObj;

  beforeEach(async () => {
    if (localServerObj && localServerObj.close) {
      await stopServer(localServerObj);
    }
    if (expressObj && expressObj.close) {
      await stopServer(expressObj);
    }
    localServerObj = await startServer(expressObj);
  });

  afterEach(async () => {
    if (localServerObj && localServerObj.close) {
      await stopServer(localServerObj);
    }
    if (expressObj && expressObj.close) {
      await stopServer(expressObj);
    }
  });

  it('get returns "server is up & running!"', async () => {
    const res = await chai.request(localServerObj).get(HEALTH_CHECK);
    expect(res.text).toBe('server is up & running!');
  });
});
