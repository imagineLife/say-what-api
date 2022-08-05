/*

  Dependencies

*/
const express = require('express');
const bodyParser = require('body-parser');
const rootRouter = require('../routes');
const { checkForDbConnection, logMW } = require('../middleware');

const STATIC_DIR = './../static';

/*

  Server Setup

*/
const expressObj = express();
expressObj.use(express.static(STATIC_DIR));

/*

  setup all-route middleware

*/
// parse application/x-www-form-urlencoded
expressObj.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
expressObj.use(bodyParser.json());
expressObj.use(checkForDbConnection);
expressObj.use(logMW);

/*

  setup express Route Handling

*/
expressObj.use('/', rootRouter);
module.exports = { expressObj };
