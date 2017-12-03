const express = require('express');
const router = express.Router();
const passport = require('passport');

const {Request} = require('./models');
const {User} = require('../users/models');
const {router: jwtStrategy} = require('../auth');

passport.use(jwtStrategy);


//Get POPULATED Request-list By user-ID
// A PROTECTED endpoint which needs a valid JWT to access it
router.get('/',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
          User
          .findById(req.user._id)
          .populate('requests')
          .exec()
          .then(user => res.status(201).json(user.requests))
          .catch(err => {
            console.error(err);
            res.status(500).json({error: 'something went terribly wrong'});
          });
    }
);

module.exports = router;