const express = require('express');
const router = express.Router();
const {Stat} = require('./models');


router.get('/', (req, res) => {
  return res.json({ok: true});
 });


//Get Default Trump 2017 Speech, by ID
router.get('/default', (req,res) => {
	Stat
		.findById("5a1ab3a26b7b26dfb8aeade3")	//LOCAL
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

module.exports = router;