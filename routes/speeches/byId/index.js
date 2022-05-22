const router = require('express').Router({mergeParams: true})

const getById = require('./get');

// single speed info
router.get(`/`, getById)

module.exports = router;