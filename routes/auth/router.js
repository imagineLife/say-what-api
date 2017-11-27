const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');

const createAuthToken = (user,callback) => {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
   }, callback )};

const router = express.Router();

router.post('/login',
  // The user provides a username and password to login
  passport.authenticate('basic', {session: false}),
  (req, res) => {
    const authToken = createAuthToken(req.user, function(err,token){
      req.user.authToken = token;
      return res.status(200).json(req.user);
    });  
  }
);

router.get('/add',
  // The user provides a jwt to login
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const authToken = createAuthToken(req.user, function(err,token){
      req.user.authToken = token;
      return res.status(200).json(req.user);
    });  
  }
);

router.post('/refresh',
  // The user exchanges an existing valid JWT for a new one with a later
  // expiration
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
  }
);

module.exports = {router};