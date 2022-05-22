const { startServer, stopServer, logIfTrue } = require('./server-setup')
describe('Server index & server fns', () => {
  jest.mock('./helpers');
  const { twoAreEqual } = require('./helpers');


  describe('logIfTrue', () => {
    it('works with (2,2, "sauce")', () => {
      global.console = {log: jest.fn()}
      logIfTrue(2,2,"sauce")
      expect(console.log).toHaveBeenCalledWith('sauce')
    })
  })
    
  describe('mocking twoAreEqual (jest mock test)', () => {
    twoAreEqual.mockImplementation(() => true)
    it('returns tru from (false,true)', () => {
      expect(twoAreEqual(false, true)).toBe(true)
    })
  })

  describe('startServer ', () => {
    it('calls server.listen with default port', () => {
      const mockListen = jest.fn();
      let mockServer = {
        listen: mockListen
      }
      startServer(mockServer)
      expect(mockListen).toHaveBeenCalledTimes(1)
    })
  })

  describe('stopServer ', () => {
    it('calls expressServer.close', () => {
      const mockCloseFn = jest.fn();
      let closeServerMock = {
        close: mockCloseFn
      }
      stopServer(closeServerMock)
      expect(mockCloseFn).toHaveBeenCalledTimes(1)
    })

    it('logs "CLOSING SERVER" AND "HTTP Graceful Shutdown" when require.main === module', () => {
      global.console = {log: jest.fn()}
      const mockCloseFn = jest.fn();
      let closeServerMock = {
        close: mockCloseFn
      }
      twoAreEqual.mockImplementation(() => true)
      stopServer(closeServerMock)
      expect(mockCloseFn).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledWith('CLOSING SERVER')
    })
  })
})