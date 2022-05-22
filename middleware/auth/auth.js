function auth(req, res, next) { 
  console.log('auth mw')
  next()
}

module.exports = auth;