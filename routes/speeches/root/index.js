const router = require('express').Router()
const getSpeeches = require('./get');
const postASpeech = require('./post');
const { assertParams } = require('./../../../middleware')

// summary of speeches
router.get(`/`, getSpeeches)
router.post('/', assertParams({body: ['orator', 'date', 'text']}), postASpeech);

module.exports = router;