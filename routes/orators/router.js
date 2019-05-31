const express = require('express');
const router = express.Router();
const Orator = require('./models');

//Get Default
router.get('/', (req, res) => {
    Orator.find().exec().then(orRes => {
        res.json(orRes)
    });    
});

module.exports = router;