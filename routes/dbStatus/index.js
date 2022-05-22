const killHandler = require('./kill')
const restartHandler = require('./restart')
const statusHandler = require('./status')
const router = require('express').Router()
const {
  routes: {
    DB: {
      KILL,
      RESTART,
      STATUS
    }
  }
} = require('./../../global/constants');

router.get(STATUS, statusHandler);
router.get(KILL, killHandler);
router.get(RESTART, restartHandler);
module.exports = router