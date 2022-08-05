// dependencies
const router = require('express').Router();
const {
  routes: { DB, HEALTH_CHECK, SPEECHES, USERS },
} = require('../global/constants');
const healthCheckHandler = require('./healthcheck');
const dbStatusHandler = require('./dbStatus');
const speechesHandler = require('./speeches');
const usersHandler = require('./users');

const routesArr = [
  {
    path: DB.ROOT,
    handler: dbStatusHandler,
  },
  {
    path: HEALTH_CHECK,
    handler: healthCheckHandler,
  },
  {
    path: SPEECHES.ROOT,
    handler: speechesHandler,
  },
  {
    path: USERS.ROOT,
    handler: usersHandler,
  },
];

for (let i = 0; i < routesArr.length; i += 1) {
  router.use(routesArr[i].path, routesArr[i].handler);
}

module.exports = router;
