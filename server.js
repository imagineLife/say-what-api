require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

//routes
const oratorsRouter = require('./routes/orators/router');
const requestsRouter = require('./routes/requests/router');
const speechesRouter = require('./routes/speeches/router');
const usersRouter = require('./routes/users/router');
const {router: authRouter, basicStrategy, jwtStrategy} = require('./routes/auth');

//swagger
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

const swaggerDefinition = {
  info: {
    title: 'Say-What-API',
    version: '0.0.1',
    description: 'Dummy description here...'
  },
  host: `localhost:${PORT}`,
  basePath: '/'
}

const swagOpts = {
  swaggerDefinition,
  apis: [`./routes/**/*.js`],
}

const swagSpec = swaggerJSDoc(swagOpts);

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use(bodyParser.json());
app.use(express.static(__dirname +'/public'));
app.use('/api/requests', requestsRouter);
app.use('/api/speeches', speechesRouter);
app.use('/orators', oratorsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);


//shows swagger specs in json object
app.use('/doc-specs', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swagSpec)
})

//Loads swagger file-by-file
// app.use('/docs', swaggerUI.serve, swaggerUI.setup(swagSpec))

//load swagger by single-yaml file
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// for closeServer access to server object, 
// storing the app.listen in this var
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {

    // https://mongoosejs.com/docs/connections.html
    mongoose.connect(databaseUrl, {
      useNewUrlParser: true,
      useCreateIndex: true
    }, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`****Your app is listening on port ${port}`); //eslint-disable-line no-console
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.

/*
  eslint-disable no-console
*/
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

/*
  eslint-enable no-console
*/

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};