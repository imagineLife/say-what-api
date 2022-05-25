const logMW = require(".");

describe('log mw', () => { 
   it('calls next fn when IS the "/db" path', () => {
     const mockReq = {
       socket: {
         remoteAddress: '867.530.999',
       },
     };
     const mockRes = jest.fn();
     const mockNxt = jest.fn();
     logMW(mockReq, mockRes, mockNxt);
     expect(mockNxt).toHaveBeenCalledTimes(1);
   });
})