require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const requestsRouter = require('./routes/requests/router');
const speechesRouter = require('./routes/speeches/router');
const usersRouter = require('./routes/users/router');
const {router: authRouter, basicStrategy, jwtStrategy} = require('./routes/auth');

const app = express();

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

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use(bodyParser.json());
app.use(express.static(__dirname +'/public'));
app.use('/api/requests', requestsRouter);
app.use('/api/speeches', speechesRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

// app.use('/login', (req,res) => {
//   req.logout();
//   res.clearCookie('authToken');
//   res.sendFile(path.resolve('public/login.html'));
// })

// app.use('/logout', (req,res) => {
//   req.logout();
//   res.clearCookie('authToken');
//   res.sendFile(path.resolve('public/splash.html'));
// })

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

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

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           console.log('sayWHAT?!');
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