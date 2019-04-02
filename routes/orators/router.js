const express = require('express');
const router = express.Router();
const {Orator} = require('./models');
const passport = require('passport');
const {router: jwtStrategy} = require('../auth');
const fs = require('fs');
var path = require('path');
passport.use(jwtStrategy);

//Get Default
router.get('/', 
  (req, res) => {
    console.log('GET orators here')
    res.status(200).send('Valid request here!')
    
    //from old default speech get
    // Stat
    // .findById("5a1ad99f978ca2681f42df12")
    // .then(stat => res.status(200).json(stat.apiRepr()))
    // .catch(err => {
    //   console.log(err);
    //   res.status(500).json({message: 'Handwritten Error :/'})
    // });
});

module.exports = router;