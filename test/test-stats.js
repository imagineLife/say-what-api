'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { app, runServer, closeServer } = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {Stat} = require('../routes/speeches/models');
const {User} = require('../routes/users/models');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');
const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('\nSpeech/Stat Request endpoints\n', function () {

  const demoSpeechStats = {
    "_id" : new mongoose.mongo.ObjectId('5a1ad99f978ca2681f42df12'),
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
    "speechTextFile" : "t2017.txt"
  };

  const jwToken = jwt.sign({}, JWT_SECRET, {
      subject: 'biggieSmalls',
      expiresIn: JWT_EXPIRY,
      algorithm: 'HS256'
     });

  before(function () {
    return runServer(TEST_DATABASE_URL, 8081);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () {
      return Stat.create(demoSpeechStats);
  });

  afterEach(function () {
    return Stat.remove();
  });

  describe('GET from /api/speeches/:id', function () {

    it('expects status, specific type, and specific id', function() {
      const token = jwt.sign(
        {
          user: {
            username: 'biggieSmalls',
            firstName: 'Notorious',
            lastName: 'Wallace'
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: 'biggieSmalls',
          expiresIn: '7d'
        }
      );
      return chai
        .request(app)
        .get('/api/speeches/5a1ad99f978ca2681f42df12')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.id).to.equal('5a1ad99f978ca2681f42df12');     //mLab
          
        });
    });
  });
  describe('GET from /api/speeches/text/5a1ad99f978ca2681f42df12', function () {
    it('expects status, type', function() {
       const token = jwt.sign(
        {
          user: {
            username: 'biggieSmalls',
            firstName: 'Notorious',
            lastName: 'Wallace'
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: 'biggieSmalls',
          expiresIn: '7d'
        }
      );
      return chai
        .request(app)
        .get('/api/speeches/text/5a1ad99f978ca2681f42df12')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
      });
    });
  });
  describe('GET from /api/speeches/speechList', function () {
    it('expects status, type, specific array keys', function() {
       const token = jwt.sign(
        {
          user: {
            username: 'biggieSmalls',
            firstName: 'Notorious',
            lastName: 'Wallace'
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: 'biggieSmalls',
          expiresIn: '7d'
        }
      );
      return chai
        .request(app)
        .get('/api/speeches/speechList')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.keys('_id', 'title', 'Orator', 'Date');
      });
    });
  });
});
