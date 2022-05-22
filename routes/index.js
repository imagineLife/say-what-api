
const router = require('express').Router()
const {
  routes: { 
    DB,
    HEALTH_CHECK,
    SPEECHES,
    USERS
  }
} = require('./../global/constants');
const healthCheckHandler =  require('./healthcheck');
const dbStatusHandler = require('./dbStatus');
const speechesHandler = require('./speeches')
const usersHandler = require('./users')

router.use(DB.ROOT, dbStatusHandler)
router.use(HEALTH_CHECK, healthCheckHandler)
router.use(SPEECHES.ROOT, speechesHandler)
router.use(USERS.ROOT, usersHandler)
/*
  /users
    get       - get list  
    post      - create one

    /:id
      get     - get info  re:user
      patch   - update    re:user
    
      /auth
        post  - first "create account"
        patch - user req.params
          ?field - update/set field



*/ 

module.exports = router;