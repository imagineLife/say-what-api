const { assertParams } = require('.')

describe('assertParams middleware', () => { 

  it('err response on missing body param', () => {
    // mock setup
    const mockOne = jest.fn()
    const mockNext = jest.fn()
    const mockStatusHandler = jest.fn();

    const mockResponse = {
      status: (str) => { 
        mockStatusHandler(str);
        return {
          json: (jsonRes) => mockOne(jsonRes)
        }
      }
    }

    const mockBody = {
      horse: 'cat'
    }
    let asserted = assertParams({ body: 'dog' });
    asserted({body: mockBody}, mockResponse, mockNext)
    expect(mockStatusHandler).toHaveBeenCalledWith(422); 
    expect(mockOne).toHaveBeenCalledWith({ Error: 'missing required params' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('err response on missing query param', () => {
    // mock setup
    const mockOne = jest.fn()
    const mockNext = jest.fn()
    const mockStatusHandler = jest.fn();

    const mockResponse = {
      status: (str) => { 
        mockStatusHandler(str);
        return {
          json: (jsonRes) => mockOne(jsonRes)
        }
      }
    }
    
    const mockObj = {
      horse: 'cat'
    }
    let asserted = assertParams({ query: 'dog' });
    asserted({query: mockObj}, mockResponse, mockNext)
    expect(mockStatusHandler).toHaveBeenCalledWith(422); 
    expect(mockOne).toHaveBeenCalledWith({ Error: 'missing required params' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('calls next on success', () => {
    // mock setup
    const mockOne = jest.fn()
    const mockNext = jest.fn()
    const mockStatusHandler = jest.fn();

    const mockResponse = {
      status: (str) => { 
        mockStatusHandler(str);
        return {
          json: (jsonRes) => mockOne(jsonRes)
        }
      }
    }
    
    const mockObj = {
      horse: 'cat'
    }
    let asserted = assertParams({ body: ['horse'] });
    asserted({ body: {horse: 'cat'} }, mockResponse, mockNext) 
    expect(mockNext).toHaveBeenCalled()
  })

  it('throws error', () => {
    // mock setup
    const mockOne = jest.fn()
    const mockNext = jest.fn()
    const mockStatusHandler = jest.fn();

    const mockResponse = {
      status: (str) => { 
        mockStatusHandler(str);
        return {
          json: (jsonRes) => mockOne(jsonRes)
        }
      }
    }
    
    const mockObj = {
      horse: 'cat'
    }

    try {
      let asserted = assertParams({ water: ['horse'] });
      asserted({ body: {horse: 'cat'} }, mockResponse, mockNext) 
    } catch (error) {
      expect(error.message.includes('TypeError: Cannot read properties of')).toBe(true)
    }
  })
})