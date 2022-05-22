const { auth, adminAuth } = require('./');


describe('Auth Middleware', () => { 
  const mockReq = {},
    mockRes = {},
    mockNxt = jest.fn();
  describe('auth', () => { 
    it('calls next fn', () => { 
      auth(mockReq, mockRes, mockNxt);
      expect(mockNxt).toHaveBeenCalledTimes(1)
    })
  })

  describe('adminAuth', () => { 
    it('calls next fn', () => { 
      adminAuth(mockReq, mockRes, mockNxt);
      expect(mockNxt).toHaveBeenCalledTimes(2)
    })
  })
})