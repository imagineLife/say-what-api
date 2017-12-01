const express = require('express');
const router = express.Router();
const {Stat} = require('./models');
const passport = require('passport');
const {router: jwtStrategy} = require('../auth');

passport.use(jwtStrategy);

router.get('/', (req, res) => {
  return res.json({ok: true});
 });


//Get Default Trump 2017 Speech, by ID
router.get('/default', (req,res) => {
	Stat
		.findById("5a1ff02cb56e0347e480296a")	//LOCAL
		// .findById("5a1ad99f978ca2681f42df12")	//CLOUD
		.then(stat => res.json(stat.apiRepr()))
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Handwritten Error :/'})
		});

});


//Get Stats By speech-ID
router.get('/:id', (req, res) => {
  Stat
    .findById(req.params.id)
    .exec()
    .then(stat => res.json(stat.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});


//Get TEXT of speech by given speech ID
router.get('/text/:id', (req, res) => {
  Stat
    .findById(req.params.id)
    .select("speechTextLink")
    .exec()
    .then(stat =>  fs.readFileSync(stat.speechTextLink, 'utf8'))
    // .then(stat => res.json(stat.speechTextLink))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});

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