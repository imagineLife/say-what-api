const express = require('express');
const router = express.Router();
const {Orator} = require('./models');
const passport = require('passport');
const {router: jwtStrategy} = require('../auth');
const fs = require('fs');
var path = require('path');
passport.use(jwtStrategy);