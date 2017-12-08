const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../../config');

const router = express.Router();

const createAuthToken = (user,callback) => {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
   }, callback )};


router.post('/login',
  passport.authenticate('basic', {session: false}),
  (req, res) => {
    const authToken = createAuthToken(req.user, function(err,token){
      req.user.authToken = token;
      // console.log('CallBack ->',token);
      return res.status(200).json(req.user);
    });  
  }
);

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh',
 passport.authenticate('jwt', {session: false}),
 (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {router};