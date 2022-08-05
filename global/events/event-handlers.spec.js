const { Collections } = require('../state');
const { logUserDetails } = require('./handlers');

describe('global event handlers', () => {
  const mockCreateOne = jest.fn(() => true);
  beforeAll(() => {
    Collections.ServerLogs = {
      createOne: mockCreateOne,
    };
  });
  describe('logUserDetails', () => {
    it('calls Collections.ServerLogs.createOne async fn and returns true', async () => {
      await logUserDetails({ test: 'obj' });
      expect(mockCreateOne).toHaveBeenCalledTimes(1);
    });
    it('throws when Collections.ServerLogs.createOne not there', async () => {
      Collections.ServerLogs = {
        createOne: null,
      };
      const res = await logUserDetails({ test: 'obj' });
      expect(res).toBe(
        'logUserDetails Error: Collections.ServerLogs.createOne is not a function'
      );
    });
  });
});
