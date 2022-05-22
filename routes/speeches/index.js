const router = require('express').Router({mergeParams: true})
const {
  routes: {
    SPEECHES
  }
} = require('./../../global/constants');
const rootRouter = require('./root');
const byIdRouter = require('./byId');


router.use(`/:speechId`, byIdRouter)
router.use(`/?`, rootRouter)

module.exports = router;