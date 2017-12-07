'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const { app, runServer, closeServer } = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {Stat} = require('../routes/speeches/models');
const { JWT_SECRET } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('\n\nSpeech/Stat Request endpoints', function () {


  const demoSpeechStats = {
    "_id" : new mongoose.mongo.ObjectId('5a1f441aee30112b4312157d'),
    "title" : "Trump 2017 Inaugural Address",
    "Orator" : "Donald Trump",
    "Date" : "Friday January 20, 2017",
    "Audience" : "Public, at the Capitol Building in Washington D.C.",
    "numberOfWords" : {
      "wordCount" : 1463,
      "uniqueWords" : 538
    },
    "mostUsedWords" : [
      {
        "word" : "our",
        "occurances" : 49
      },
      {
        "word" : "we",
        "occurances" : 48
      },
      {
        "word" : "will",
        "occurances" : 43
      },
      {
        "word" : "America",
        "occurances" : 19
      },
      {
        "word" : "you",
        "occurances" : 15
      },
      {
        "word" : "all",
        "occurances" : 15
      },
      {
        "word" : "but",
        "occurances" : 13
      },
      {
        "word" : "are",
        "occurances" : 12
      },
      {
        "word" : "their",
        "occurances" : 11
      },
      {
        "word" : "American",
        "occurances" : 11
      }
    ],
    "wordsBySize" : [
      {
        "size" : 3,
        "occurances" : 351
      },
      {
        "size" : 4,
        "occurances" : 242
      },
      {
        "size" : 2,
        "occurances" : 235
      },
      {
        "size" : 5,
        "occurances" : 187
      },
      {
        "size" : 7,
        "occurances" : 118
      }
    ],
    "bigWords" : [
      "infrastructure",
      "administration",
      "understanding",
      "disagreements",
      "establishment",
      "redistributed",
      "neighborhoods",
      "transferring",
      "technologies",
      "importantly",
      "immigration",
      "magnificent"
    ],
    "speechTextLink" : "../speechText/t2017.txt"
  };
  
  before(function () {
    return runServer(TEST_DATABASE_URL, 8081);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () {
      
      return Stat.create(demoSpeechStats)
      .then((stat) => {
        return stat;
      });
    // return User.hashPassword(password).then(password =>
      
    //   User.create({
    //     username,
    //     password,
    //     firstName,
    //     lastName
    //   })
    
    // );
  });

  afterEach(function () {
    return Stat.remove();
  });

  describe('GET from /api/requests', function () {
 
    it('should return default speech stats', function() {
      // strategy:
      //    1. get back all stats returned by by GET request to `/stats`
      //    2. prove res has right status, data type
      //    3. prove the number of stats we got back is equal to number
      //       in db.
      // need to have access to mutate and access `res` across
      // `.then()` calls below, so declare it here so can modify in place
      let res;
      return chai.request(app)
        .get('/api/speeches/default')
        .then(function(_res) {
          // so subsequent .then blocks can access resp obj.
          res = _res;
          // res.should.have.status(200);
          // otherwise our db seeding didn't work
          // res.body.quickstats.should.have.length.of.at.least(1);
          expect(res.body).to.contain.keys('title', 'Orator');
          return Stat.count();
        })
    });
  
  });
});
