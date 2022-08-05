const logMW = require('.');
const { logUserDetails } = require('../../global/events/handlers');

jest.mock('../../global/events/handlers');
describe('log mw', () => {
  const mockFn = jest.fn(() => true);
  beforeAll(() => {
    logUserDetails.mockImplementation(mockFn);
  });

  it('calls next() and logUserDetails functions', () => {
    const mockReq = {
      socket: {
        remoteAddr: '1234',
      },
    };
    const mockRes = jest.fn();
    const mockNxt = jest.fn();
    logMW(mockReq, mockRes, mockNxt);
    expect(mockNxt).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
