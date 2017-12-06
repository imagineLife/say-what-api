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

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('\nRequest endpoints\n', function () {
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
  });

  afterEach(function () {
    return User.remove({});
  });

  describe('\nPOST to /api/requests\n', function () {
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
    // it('Should return a valid auth token', function () {
    // /*
    //   ONCE the app is working, we need to retrieve the auth token. 
    //     its being created, but for now its only-on-the-server.
    // */
    //   return chai
    //     .request(app)
    //     .post('/api/requests')
    //     .set('Authorization', 'Bearer ZXhhbXBsZVVzZXI6ZXhhbXBsZVBhc3M=')
    //     .set('Content-Type', 'application/json')
    //     .send({ username, password })
    //     .then(res => {
    //       console.log('\nres.status & body->',res.status,res.body);
    //       expect(res).to.have.status(200);
    //       expect(res.body).to.be.an('object');
    //       const token = res.body.authToken;
    //       expect(token).to.be.a('string');
    //       const payload = jwt.verify(token, JWT_SECRET, {
    //         algorithm: ['HS256']
    //       });
    //       expect(res.body).to.have.keys('username', 'firstName', 'lastName', 'requests');
    //     });
    // });
    it('Should send request & return proper response', function() {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          }
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
          // expect(res.body.data).to.equal('rosebud');
        });
    });
    // it('Should reject requests with an invalid token', function() {
    //   const token = jwt.sign(
    //     {
    //       username,
    //       firstName,
    //       lastName
    //     },
    //     'wrongSecret',
    //     {
    //       algorithm: 'HS256',
    //       expiresIn: '7d'
    //     }
    //   );

    //   return chai
    //     .request(app)
    //     .post('/api/requests')
    //     .set('Authorization', `Bearer ${token}`)
    //     .then(() =>
    //       expect.fail(null, null, 'Request should not succeed')
    //     )
    //     .catch(err => {
    //       if (err instanceof chai.AssertionError) {
    //         throw err;
    //       }

    //       const res = err.response;
    //       expect(res).to.have.status(401);
    //     });
    // });
    // it('Should reject requests with an expired token', function() {
    //   const token = jwt.sign(
    //     {
    //       user: {
    //         username,
    //         firstName,
    //         lastName
    //       },
    //       exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
    //     },
    //     JWT_SECRET,
    //     {
    //       algorithm: 'HS256',
    //       subject: username
    //     }
    //   );

    //   return chai
    //     .request(app)
    //     .get('/api/protected')
    //     .set('authorization', `Bearer ${token}`)
    //     .then(() =>
    //       expect.fail(null, null, 'Request should not succeed')
    //     )
    //     .catch(err => {
    //       if (err instanceof chai.AssertionError) {
    //         throw err;
    //       }

    //       const res = err.response;
    //       expect(res).to.have.status(401);
    //     });
    // });
  });

  // describe('POST to /auth/refresh', function () {
  //   it('Should reject requests with no credentials', function () {
  //     return chai
  //       .request(app)
  //       .post('/api/auth/refresh')
  //       .then(() =>
  //         expect.fail(null, null, 'Request should not succeed')
  //       )
  //       .catch(err => {
  //         if (err instanceof chai.AssertionError) {
  //           throw err;
  //         }

  //         const res = err.response;
  //         expect(res).to.have.status(401);
  //       });
  //   });
  //   it('Should reject requests with an invalid token', function () {
  //     const token = jwt.sign(
  //       {
  //         username,
  //         firstName,
  //         lastName
  //       },
  //       'wrongSecret',
  //       {
  //         algorithm: 'HS256',
  //         expiresIn: '7d'
  //       }
  //     );

  //     return chai
  //       .request(app)
  //       .post('/api/auth/refresh')
  //       .set('Authorization', `Bearer ${token}`)
  //       .then(() =>
  //         expect.fail(null, null, 'Request should not succeed')
  //       )
  //       .catch(err => {
  //         if (err instanceof chai.AssertionError) {
  //           throw err;
  //         }

  //         const res = err.response;
  //         expect(res).to.have.status(401);
  //       });
  //   });
  //   it('Should reject requests with an expired token', function () {
  //     const token = jwt.sign(
  //       {
  //         user: {
  //           username,
  //           firstName,
  //           lastName
  //         },
  //         exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
  //       },
  //       JWT_SECRET,
  //       {
  //         algorithm: 'HS256',
  //         subject: username
  //       }
  //     );

  //     return chai
  //       .request(app)
  //       .post('/api/auth/refresh')
  //       .set('authorization', `Bearer ${token}`)
  //       .then(() =>
  //         expect.fail(null, null, 'Request should not succeed')
  //       )
  //       .catch(err => {
  //         if (err instanceof chai.AssertionError) {
  //           throw err;
  //         }

  //         const res = err.response;
  //         expect(res).to.have.status(401);
  //       });
  //   });
  //   it('Should return a valid auth token with a newer expiry date', function () {
  //     const token = jwt.sign(
  //       {
  //         user: {
  //           username,
  //           firstName,
  //           lastName
  //         }
  //       },
  //       JWT_SECRET,
  //       {
  //         algorithm: 'HS256',
  //         subject: username,
  //         expiresIn: '7d'
  //       }
  //     );
  //     const decoded = jwt.decode(token);

  //     return chai
  //       .request(app)
  //       .post('/api/auth/refresh')
  //       .set('authorization', `Bearer ${token}`)
  //       .then(res => {
  //         expect(res).to.have.status(200);
  //         expect(res.body).to.be.an('object');
  //         const token = res.body.authToken;
  //         expect(token).to.be.a('string');
  //         const payload = jwt.verify(token, JWT_SECRET, {
  //           algorithm: ['HS256']
  //         });
  //         expect(payload.user).to.deep.equal({
  //           username,
  //           firstName,
  //           lastName
  //         });
  //         expect(payload.exp).to.be.at.least(decoded.exp);
  //       });
  //   });
  // });
});
