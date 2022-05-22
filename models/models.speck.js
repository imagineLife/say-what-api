const { Users } = require('.')
describe('User model CRUD', () => {
  let dbClient;
  // beforeAll(async () => { 
  //   // unauthenticated db connection
  //   dbClient = await setupDB({
  //     host: 'localhost',
  //     port: '27017',
  //   })
  // })
  // holds user obj through test duration
  let userDbObj;

  const mockUser = {
    first: 'joe',
    last: 'jones',
    email: 'horse@cat.com'
  }

  it('Creates a user', async () => {
    let userObj = await Users.createOne({ ...mockUser })
    console.log('userObj')
    console.log(userObj)
    
    expect(userObj.first).toBe(mockUser.first)
  })
})