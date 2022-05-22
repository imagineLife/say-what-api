const postUsers = require('.');
 
describe('Users:id POST', () => { 
  it('returns expected res', () => { 
    const mockSend = jest.fn()
    const mockStatus = (n) => { 
      return {
        send: mockSend
      }
    } 
    const a = {};
    const b = {
      status: mockStatus,
      send: mockSend
    }
    const c = {}
    postUsers(a, b, c);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith('post user by id');
  })
})