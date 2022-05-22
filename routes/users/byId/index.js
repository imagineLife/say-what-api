const router = require('express').Router({ mergeParams: true })
const getHandler = require('./get')
const patchHandler = require('./patch')

router.get(`/`, getHandler)
router.patch(`/`, patchHandler)

module.exports = router;