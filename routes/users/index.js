/*
  dependencies
*/ 
const router = require('express').Router({ mergeParams: true })
const {
  routes: {
    USERS
  }
} = require('./../../global/constants');
const rootRouter = require('./root');
const byIdRouter = require('./byId');


/*
  register handlers
*/ 
router.use(USERS.BY_ID, byIdRouter)
router.use(`/?`, rootRouter)

module.exports = router;