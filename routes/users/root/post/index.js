/*
  Dependencies
*/
const {
  GLOBAL_STATE: { Collections },
} = require('../../../../global');

async function postUsers(req, res) {
  try {
    const {
      body: { first, email },
    } = req;
    const { Users } = Collections;
    await Users.createOne({ email, first });
    return res.status(200).json({ works: 'qwer' });
  } catch (e) {
    console.log('postUsers error:');
    console.log(e.message);
    return res.status(500).json({ Error: 'postUsers error' });
  }
}

module.exports = postUsers;
