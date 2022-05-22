function getUsers(req, res, next) { 
  return res.status(200).send('get users')
}

module.exports = getUsers;