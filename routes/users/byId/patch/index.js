function postUsers(req, res, next) { 
  return res.status(200).send('post user by id')
}

module.exports = postUsers;