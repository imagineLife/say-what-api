const express = require('express');
const router = express.Router();
const {Request} = require('./models');
const passport = require('passport');
const {router: jwtStrategy} = require('../auth');

passport.use(jwtStrategy);


//Get Request-list By user-ID
// A PROTECTED endpoint which needs a valid JWT to access it
router.get('/api/requests',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
          Request
          .findById(req.user._id)
          .populate({path: 'suggestions'})
          .exec()
          .then(user => res.status(201).json(user.suggestions))
          .catch(err => {
            console.error(err);
            res.status(500).json({error: 'something went terribly wrong'});
          });
    }
);


router.post('/request',
  passport.authenticate('jwt', {session: false, failWithError: true}),
  (req,res) => {
    
//Make-Sure request has necessary fields
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
        user: req.user._id
      })
      .then(requestMade => {
        let id = requestMade.user;      
        User  
          .findByIdAndUpdate(id,
          { "$push": { "requestMade": requestMade._id } },
          {"new" : true},
          function(err,user){
            console.log(user);
          }
        )
        return requestMade;
      })
      .then(requestMade => {res.status(201).json(requestMade.apiRepr()) })
      .catch(err => {
          console.error(err);
          res.status(500).json({error: 'Something went wrong'});
      });
})

module.exports = router;