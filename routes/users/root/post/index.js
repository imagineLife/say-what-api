/*
  Dependencies
*/ 
const {
  GLOBAL_STATE: { 
    Collections
  } 
 } = require('./../../../../global')

async function postUsers(req, res, next) { 
  try {
    let {
      body: { first, email }
    } = req;
    let { Users } = Collections;
    let createdUser = await Users.createOne({ email, first })
    return res.status(200).json({works: 'qwer'})
  } catch (e) { 
    console.log('postUsers error:')
    console.log(e.message)
    res.status(500).json({Error: 'postUsers error'})
  }
}

module.exports = postUsers;