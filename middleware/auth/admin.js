function adminAuth(req, res, next) {
  console.log('adminAuth MW')
  
  next()
}

module.exports = adminAuth;