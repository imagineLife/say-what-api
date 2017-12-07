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
		.findById("5a1f441aee30112b4312157d")	//LOCAL
		// .findById("5a1ad99f978ca2681f42df12")	//CLOUD
		.then(stat => res.json(stat.apiRepr()))
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Handwritten Error :/'})
		});

});


//Get Default Trump 2017 Speech
router.get('/speechList', (req,res) => {
  Stat
    .find().select('_id title') //LOCAL
    .then(stat => res.json(stat))
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Handwritten Error :/'})
    });

});

//Get Stats By speech-ID
router.get('/:id', 
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
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

module.exports = router;