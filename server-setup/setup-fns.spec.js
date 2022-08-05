const { setupDB } = require('./setup-fns');

describe('server-setup setup-fns', () => {
  describe('setupDB', () => {
    let mongoConnection;

    beforeEach(() => {
      process.env.MONGO_AUTH = false;
    });
    afterEach(async () => {
      if (mongoConnection) await mongoConnection.close();
    });

    it('logs and returns null on error', async () => {
      jest.spyOn(global.console, 'log');
      const res = await setupDB({
        host: '1234',
      });
      expect(res).toBe(null);
    });

    it('calls DB model with success', async () => {
      process.env.MONGO_AUTH = false;
      mongoConnection = await setupDB({ host: 'localhost', port: '27017' });
      expect(mongoConnection.client.s.url).toBe(
        'mongodb://localhost:27017/?connectTimeoutMS=2500'
      );
    });
  });
});
