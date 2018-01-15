const express = require('express');
const router = express.Router();
const {Stat} = require('./models');
const passport = require('passport');
const {router: jwtStrategy} = require('../auth');
const fs = require('fs');
passport.use(jwtStrategy);
var path = require('path');

//Get Default Trump 2017 Speech
router.get('/default', (req,res) => {
	Stat
		.findById("5a1ad99f978ca2681f42df12")
		.then(stat => res.status(200).json(stat.apiRepr()))
		.catch(err => {
			console.log(err);
			res.status(500).json({message: 'Handwritten Error :/'})
		});
});


//Get TEXT of speech by given speech ID
router.get('/text/default', 
  (req, res) => {
  Stat
    .findById("5a1ad99f978ca2681f42df12", ['title', 'speechTextLink'], (err, docs) => {
    })
    .exec()
    .then((stat) =>  {
     return ({
      text  : fs.readFileSync(path.join(__dirname, '../'+stat.speechTextLink), 'utf8'),
      title : stat.title 
     })
    })
    .then(speechText => res.json(speechText))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});



//Get speech List
router.get('/speechList',
  passport.authenticate('jwt', { session: false }),
 (req,res) => {
  Stat
    .find().select('_id title Orator Date').sort('-Date') //LOCAL
    .then(stat => res.json(stat))
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Handwritten Error :/'})
    });
});

//Get Stats By speech-ID
router.get('/:id', 
  passport.authenticate('jwt', { session: false }),
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
router.get('/text/:id', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
  Stat
    .findById(req.params.id)
    .exec()
    .then((stat) =>  {
     return ({
      text  : fs.readFileSync(path.join(__dirname, '../'+stat.speechTextLink), 'utf8'),
      title : stat.title 
     })
    })
    .then(speechText => res.json(speechText))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});

module.exports = router;