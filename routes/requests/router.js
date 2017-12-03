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

router.post('/',
  passport.authenticate('jwt', {session: false, failWithError: true}),
  (req, res) => {
    const requiredFields = ['type', 'text'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }

    Request
      .create({
        type: req.body.type,
        text: req.body.text,
        Date: new Date(),
        user: req.user._id
      })
      .then(request => {
        let id = request.user;      
        User  
          .findByIdAndUpdate(id,
          { "$push": { "requests": request._id } },
          {"new" : true},
          function(err,user){
            console.log(user);
          }
        )
        return request;
      })
      .then(request => {res.status(201).json(request.apiRepr()) })
      .catch(err => {
          console.error(err);
          res.status(500).json({error: 'Something went wrong'});
      });
  }
);

module.exports = router;