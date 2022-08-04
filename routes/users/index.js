/*
  dependencies
*/
const router = require('express').Router({ mergeParams: true });
const {
  routes: { USERS },
} = require("../../global/constants");
const rootRouter = require('./root');
const byIdRouter = require('./byId');

/*
  "/users" route summary

    get       - get list  
    post      - create one

    "/:id" summary
      get     - get info  re:user
      patch   - update    re:user
    
      /auth
        post  - first "create account"
        patch - user req.params
          ?field - update/set field
*/

/*
  register handlers
*/
router.use(USERS.BY_ID, byIdRouter);
router.use(`/?`, rootRouter);

module.exports = router;
