const router = require('express').Router({ mergeParams: true })
const getUsers = require('./get')
const postUsers = require('./post')
const { assertParams } = require('./../../../middleware')
router.get(`/`, getUsers)
router.post(`/`, assertParams({body: ['email', 'first']}), postUsers)

module.exports = router;