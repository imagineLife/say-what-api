const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {User} = require('../routes/users/models');
const {JWT_SECRET} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('\nUsers API endpoints \n', function() {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';
  const email = 'dummyemail@gmail.com';
  const emptyTrip = [];
  const usernameB = 'exampleUserB';
  const passwordB = 'examplePassB';
  const firstNameB = 'ExampleB';
  const lastNameB = 'UserB';
  const emptyTripB = [];

  before(function() {
    return runServer(TEST_DATABASE_URL, 8081);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
  });

  afterEach(function() {
    return User.remove({});
  });

  describe('\nPOST to /users/register endpoint\n', function() {
    it('Should reject users with missing username', function() {
      return chai.request(app)
        .post('/api/users/register')
        .send({
          password,
          firstName,
          lastName,
          email
        })
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Missing field');
          expect(res.body.location).to.equal('username');
        });
    });
    it('Should reject users with missing password', function() {
      return chai.request(app)
        .post('/api/users/register')
        .send({
          username,
          firstName,
          lastName,
          email
        })
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Missing field');
          expect(res.body.location).to.equal('password');
        });
    });
    it('Should reject users with number-style username', function() {
      return chai.request(app)
        .post('/api/users/register')
        .send({
          username: 1234,
          password,
          firstName,
          lastName,
          email
        })
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Incorrect field type: expected string');
          expect(res.body.location).to.equal('username');
        });
    });
    it('Should reject users with number-style password', function() {
      return chai.request(app)
        .post('/api/users/register')
        .send({
          username,
          password: 1234,
          firstName,
          lastName,
          email
        })
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Incorrect field type: expected string');
          expect(res.body.location).to.equal('password');
        });
    });
    it('Should reject users with integer first name', function() {
      return chai.request(app)
        .post('/api/users/register')
        .send({
          username,
          password,
          firstName: 1234,
          lastName,
          email
        })
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Incorrect field type: expected string');
          expect(res.body.location).to.equal('firstName');
        });
    });
    it('Should reject users with integer last name', function() {
      return chai.request(app)
        .post('/api/users/register')
        .send({
          username,
          password,
          firstName,
          lastName: 1234,
          email
        })
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Incorrect field type: expected string');
          expect(res.body.location).to.equal('lastName');
        });
    });
    it('Should reject users with non-trimmed username', function() {
      return chai.request(app)
        .post('/api/users/register')
        .send({
          username: ` ${username} `,
          password,
          firstName,
          lastName,
          email
        })
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Cannot start or end with whitespace');
          expect(res.body.location).to.equal('username');
        });
    });
    it('Should reject users with non-trimmed password', function() {
      return chai.request(app)
        .post('/api/users/register')
        .send({
          username,
          password: ` ${password} `,
          firstName,
          lastName,
          email
        })
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Cannot start or end with whitespace');
          expect(res.body.location).to.equal('password');
        });
    });
    it('Should reject users with empty username', function() {
      return chai.request(app)
        .post('/api/users/register')
        .send({
          username: '',
          password,
          firstName,
          lastName,
          email
        })
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Must be at least 1 characters long');
          expect(res.body.location).to.equal('username');
        });
    });
    it('Should reject users with password less than eight characters', function() {
      return chai.request(app)
        .post('/api/users/register')
        .send({
          username,
          password: '1234567',
          firstName,
          lastName,
          email
        })
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Must be at least 8 characters long');
          expect(res.body.location).to.equal('password');
        });
    });
    it('Should reject users with password greater than 72 characters', function() {
      return chai.request(app)
        .post('/api/users/register')
        .send({
          username,
          password: new Array(73).fill('a').join(''),
          firstName,
          lastName,
          email
        })
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Must be at most 72 characters long');
          expect(res.body.location).to.equal('password');
        });
    });
    it('Should reject users with duplicate username', function() {
      // Create an initial user
      return User.create({
        username,
        password,
        firstName,
        lastName,
        email
      })
      .then(() =>
        // Try to create a second user with the same username
        chai.request(app)
          .post('/api/users/register')
          .send({
            username,
            password,
            firstName,
            lastName,
            email
          })
      )
      .then(() => expect.fail(null, null, 'Request should not succeed'))
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }

        const res = err.response;
        expect(res).to.have.status(422);
        expect(res.body.reason).to.equal('ValidationError');
        expect(res.body.message).to.equal('Username already taken');
        expect(res.body.location).to.equal('username');
      });
    });
    it('Should create a new user', function() {
      return chai.request(app)
        .post('/api/users/register')
        .send({
          username,
          password,
          firstName,
          lastName,
          email
        })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('username', 'firstName', 'lastName', 'email'); // had 'requests',
          expect(res.body.username).to.equal(username);
          expect(res.body.firstName).to.equal(firstName);
          expect(res.body.lastName).to.equal(lastName);
          return User.findOne({
            username
          });
        })
        .then(user => {
          expect(user).to.not.be.null;
          expect(user.firstName).to.equal(firstName);
          expect(user.lastName).to.equal(lastName);
          return user.validatePassword(password);
        })
        .then(passwordIsCorrect => {
          expect(passwordIsCorrect).to.be.true;
        });
    });
    it('Should trim firstName and lastName', function() {
      return chai.request(app)
        .post('/api/users/register')
        .send({
          username,
          password,
          firstName: ` ${firstName} `,
          lastName: ` ${lastName} `,
          email
        })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('username', 'firstName', 'lastName', 'email'); // had 'requests',
          expect(res.body.username).to.equal(username);
          expect(res.body.firstName).to.equal(firstName);
          expect(res.body.lastName).to.equal(lastName);
          return User.findOne({
            username
          });
        })
        .then(user => {
          expect(user).to.not.be.null;
          expect(user.firstName).to.equal(firstName);
          expect(user.lastName).to.equal(lastName);
        })
    });
  });
});
