require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const {PORT, DATABASE_URL} = require('./config');

mongoose.Promise = global.Promise;

/*
Route Setup
  using different file-paths per route
*/
// const authRouter = require('./routes/auth/router');
const speechRouter = require('./routes/speeches/router');
const userRouter = require('./routes/users/router');
const {router:authRouter, basicStrategy, jwtStrategy} = require('./routes/auth/');

/*
APP setup
  using passport, passport strategies,
  & bodyParser
*/
const app = express();
app.use('/api/auth', authRouter);
app.use('/api/speech', speechRouter);
app.use('/api/user', userRouter);
app.use(bodyParser.json());
app.use(passport.initialize());



// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});


passport.use(basicStrategy);
passport.use(jwtStrategy);

/*
	create server var
	runServer sets value
	closeServer the var
*/
let server;


function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  console.log('databaseUrl->',databaseUrl);
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`****Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

//close the server
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

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

 module.exports = {app, runServer, closeServer};