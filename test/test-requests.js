'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {User} = require('../routes/users/models');
const {Request} = require('../routes/requests/models');
const { JWT_SECRET } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('\n\nRequests endpoints\n', function () {
  const demoReq = {
    "type" : 1,
    "text" : "Can you add a keyword-search?",
    "Date" : new Date(),
    "user" : "5a1ff02cb56e0347e480296a"
  };

  const username = "exampleUser";
  const password = "examplePass";
  const firstName = 'Christopher';
  const lastName = 'Wallace';
  const myUN = "biggieSmalls";
  const myPW = "ReadyToDie";
  
  before(function () {
    return runServer(TEST_DATABASE_URL, 8081);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () {
      
    return User.hashPassword(password).then(password =>
      
      User.create({
        username,
        password,
        firstName,
        lastName
      })
    
    );

    // console.log('beforeEach', User);
  
  });

  afterEach(function () {
    return User.remove({});
  });

  describe('POST to /api/requests\n', function () {
    it('Should reject requests with no credentials: code 401', function () {
      return chai
      .request(app)
      .post('/api/requests')
      .then(() =>
        expect.fail(null, null, 'Request should not succeed')
      )
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }

        const res = err.response;
        expect(res).to.have.status(401);
      })
    });
    it('Should return proper status, keys, and type', function() {
      const token = jwt.sign(
        {
          user: { username, firstName, lastName }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .post('/api/requests')
        .set('authorization', `Bearer ${token}`)
        .send({"type" : 1, "text" : "Can you add a keyword-search, please?"})
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.keys('id', 'type', 'text', 'Date');
          expect(res.body).to.be.an('object');
        });
    });
    it('Should reject requests with an invalid token', function() {
      const token = jwt.sign(
        {
          username,
          firstName,
          lastName
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${token}`)
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        });
    });
    it('Should reject requests with an expired token', function() {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          },
          exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username
        }
      );

      return chai
        .request(app)
        .get('/api/requests')
        .set('authorization', `Bearer ${token}`)
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
  });
});
