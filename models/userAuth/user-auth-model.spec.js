const { UserAuth } = require('.');
const { setupDB } = require('../../server-setup');

describe('UserAuth Model', () => {
  const COLL_NAME = 'TestUsers';
  const DB_NAME = 'TestSayWhat';
  let TestMongoClient;
  let TestSayWhat;
  let Cat;
  const dbObj = {
    host: 'localhost',
    port: '27017',
  };
  beforeAll(async () => {
    process.env.MONGO_AUTH = false;
    TestMongoClient = await setupDB({ ...dbObj });
    TestSayWhat = TestMongoClient.registerDB(DB_NAME);
    Cat = new UserAuth({ db: TestSayWhat, collection: COLL_NAME });
    await Cat.deleteOne({ id: 'horse@sauce.com' });
  });

  afterAll(async () => {
    try {
      await TestMongoClient.close();
    } catch (e) {
      console.log('afterAll catch error');
      console.log(e.message);
    }
  });

  it('Crud.collectionName matches input param', () => {
    expect(Cat.collectionName).toBe(COLL_NAME);
  });

  const expectedKeys = [
    'connectionObj',
    'client',
    'db',
    'collectionName',
    'collection',
  ];
  it.each(expectedKeys)(`%s key is present`, (xKey) => {
    const catKeys = Object.getOwnPropertyNames(Cat);
    expect(catKeys.includes(xKey)).toBe(true);
  });

  describe('methods', () => {
    it('hashVal... returns a hash?!', () => {
      const input = 'testString';
      const output =
        'c48af5a7f6d4a851fc8a434eed638ab1a6ef68e19dbcae894ac67c9fbc5bcb0182b8e7123b3df3c9e4dcb7690c23103f03dc17f54352071ceb2a4eb204b26b91';
      const res = Cat.hashVal(input);
      expect(res).toBe(output);
    });

    it('createOne: fails with invalid email string', async () => {
      try {
        await Cat.createOne({ email: 'horse' });
      } catch (e) {
        expect(e.message).toBe(
          `Cannot call UserAuth createOne without a valid email address`
        );
      }
    });

    it('oneHourFromNow', () => {
      const timeRes = Cat.oneHourFromNow();
      expect(typeof timeRes).toBe('object');
    });

    describe('registrationExpired', () => {
      it('returns false with timestamps is now', () => {
        const now = new Date();
        const nowInMS = Date.parse(now);
        const overAnHourAgo = nowInMS - Cat.registration_exp_duration - 10;
        const hourAgoDate = new Date(overAnHourAgo);
        const expired = Cat.registrationExpired(hourAgoDate);
        expect(expired).toBe(true);
      });

      it('returns true with timestamps is 1 hour - 10 ms ago', () => {
        const now = new Date();
        const expired = Cat.registrationExpired(now);
        expect(expired).toBe(false);
      });
    });

    describe('isAnEmailString', () => {
      const failArr = [
        'water@melon',
        '@melon.sauce',
        'water.sauce',
        'ice@water@melon.sause.com',
      ];
      const passingArr = [
        'juice@box.com',
        'water@melon.com',
        'water.melon@hotSauce.com',
      ];
      describe('fails with...', () => {
        it.each(failArr)(`%s`, (str) => {
          expect(Cat.isAnEmailString(str)).toBe(null);
        });
      });
      describe('passes with...', () => {
        it.each(passingArr)(`%s`, (passingStr) => {
          expect(Cat.isAnEmailString(passingStr)[0]).toBe(
            passingStr.toLowerCase()
          );
        });
      });
    });

    describe('registerEmail', () => {
      describe('returns error...', () => {
        it('without email param', async () => {
          try {
            await Cat.registerEmail();
          } catch (e) {
            expect(e.message).toBe(
              "Cannot destructure property 'email' of 'undefined' as it is undefined."
            );
          }
        });

        const failArr = [
          'water@melon',
          '@melon.sauce',
          'water.sauce',
          'ice@water@melon.sause.com',
        ];
        it.each(failArr)('valid email address %s', async (str) => {
          try {
            await Cat.registerEmail({ email: str });
          } catch (e) {
            expect(e.message).toBe(
              'Cannot call registerEmail without a valid email address'
            );
          }
        });
      });

      describe('works', () => {
        let res;
        const registerEmailStr = 'horse@sauce.com';

        it('method returns expected object', async () => {
          res = await Cat.registerEmail({ email: registerEmailStr });

          // types
          expect(typeof res).toBe('object');
          expect(typeof res.insertedId).toBe('string');
          expect(typeof res.acknowledged).toBe('boolean');

          // res object inspection
          expect(Object.keys(res).length).toBe(2);
          expect(res.acknowledged).toBe(true);
          expect(res.insertedId).toBe(registerEmailStr);
        });

        it('GETS user from db by id && assures expected fields exist', async () => {
          const foundUser = await Cat.readOne({ _id: res.insertedId });
          expect(foundUser._id).toBe(registerEmailStr);
          expect(typeof foundUser.created_date).toBe('object');
          expect(typeof foundUser.registration_expires).toBe('object');
        });
      });
    });

    describe('validateEmail', () => {
      const validateEmailStr = 'validate@email.stringtest';
      let createUserRes;

      beforeEach(async () => {
        await Cat.deleteOne({ id: validateEmailStr });
      });
      afterEach(async () => {
        await Cat.deleteOne({ id: validateEmailStr });
      });

      describe('fails when', () => {
        it('bad user email address', async () => {
          createUserRes = await Cat.registerEmail({ email: validateEmailStr });
          try {
            await Cat.validateEmail({ email: 'water@mel-uhn' });
          } catch (e) {
            expect(e.message).toBe(
              'Cannot call validateEmail without a valid email address'
            );
          }
        });
        it('user email is not present', async () => {
          const res = await Cat.validateEmail({
            email: 'thisUser@isnot.present',
          });
          expect(res).toBe(false);
        });
        it('user email is present and registration has expired (hack for test)', async () => {
          // set the registration_expires to several hours ago
          createUserRes = await Cat.registerEmail({ email: validateEmailStr });
          const now = new Date();
          const nowMS = Date.parse(now);
          const severalHoursAgo = nowMS - Cat.registration_exp_duration * 7;
          const parsedOlderDate = new Date(severalHoursAgo);
          await Cat.updateOne(
            { _id: validateEmailStr },
            { $set: { registration_expires: parsedOlderDate } }
          );

          // attempt
          const emailValidated = await Cat.validateEmail({
            email: validateEmailStr,
          });

          // assert
          expect(emailValidated).toBe('expired');
        });
      });

      it('returns true from email created now', async () => {
        // create user
        createUserRes = await Cat.registerEmail({ email: validateEmailStr });
        const validateEmailRes = await Cat.validateEmail({
          email: createUserRes.insertedId,
        });
        expect(validateEmailRes).toBe(true);
        // validate user
      });
    });

    describe('setPW', () => {
      const validateEmailStr = 'validate@email.stringtest';
      let createUserRes;

      describe('fails without', () => {
        it('email param', async () => {
          try {
            await Cat.setPW({ pw: 'newPW' });
          } catch (e) {
            expect(e.message).toBe(
              'cannot call UserAuth.setPW without email or pw'
            );
          }
        });

        it('pw param', async () => {
          try {
            await Cat.setPW({ email: 'dummy@email.com' });
          } catch (e) {
            expect(e.message).toBe(
              'cannot call UserAuth.setPW without email or pw'
            );
          }
        });
      });

      it('succeeds', async () => {
        createUserRes = await Cat.registerEmail({ email: validateEmailStr });
        await Cat.validateEmail({
          email: createUserRes.insertedId,
        });
        const res = await Cat.setPW({
          email: createUserRes.insertedId,
          pw: 'new-pw-who-dis',
        });
        const expectedRes = {
          acknowledged: true,
          matchedCount: 1,
          modifiedCount: 1,
          upsertedCount: 0,
          upsertedId: null,
        };
        expect(res.acknowledged).toBe(expectedRes.acknowledged);
        expect(res.matchedCount).toBe(expectedRes.matchedCount);
        expect(res.modifiedCount).toBe(expectedRes.modifiedCount);
        expect(res.upsertedCount).toBe(expectedRes.upsertedCount);
        expect(res.upsertedId).toBe(expectedRes.upsertedId);
      });
    });

    describe('validatePW', () => {
      const validatePW = 'validate@email.stringtest';
      let createUserRes;

      describe('fails without', () => {
        it('email param', async () => {
          try {
            await Cat.validatePW({ pw: 'newPW' });
          } catch (e) {
            expect(e.message).toBe(
              'cannot call UserAuth.validatePW without email or pw'
            );
          }
        });

        it('pw param', async () => {
          try {
            await Cat.validatePW({ email: 'dummy@email.com' });
          } catch (e) {
            expect(e.message).toBe(
              'cannot call UserAuth.validatePW without email or pw'
            );
          }
        });
      });

      describe('email present', () => {
        beforeEach(async () => {
          await Cat.deleteOne({ id: validatePW });
        });
        afterEach(async () => {
          await Cat.deleteOne({ id: validatePW });
        });
        it('returns false when pw is incorrect', async () => {
          createUserRes = await Cat.registerEmail({ email: validatePW });
          await Cat.setPW({
            email: createUserRes.insertedId,
            pw: 'new-pw-who-dis',
          });
          const validatePWRes = await Cat.validatePW({
            email: validatePW,
            pw: 'failable-pw',
          });
          expect(validatePWRes).toBe(false);
        });

        it('returns true when pw is correct', async () => {
          createUserRes = await Cat.registerEmail({ email: validatePW });
          await Cat.setPW({
            email: createUserRes.insertedId,
            pw: 'new-pw-who-dis',
          });
          const validatePWRes = await Cat.validatePW({
            email: validatePW,
            pw: 'new-pw-who-dis',
          });
          expect(validatePWRes).toBe(true);
        });
      });
    });
    it('requestPwReset', () => {
      const res = Cat.requestPwReset();
      expect(res).toBe('UserAuth requestPwReset Here');
    });
  });

  it('ERR on registerEmail when no db connection', async () => {
    try {
      await TestMongoClient.close();
      await Cat.registerEmail({ email: 'failable@user.emailaddress' });
    } catch (e) {
      expect(e.message).toBe(
        'Error: MongoNotConnectedError: Client must be connected before running operations'
      );
    } finally {
      await TestMongoClient.connect();
    }
  });
  it('ERR on setPW when no db connection', async () => {
    try {
      await TestMongoClient.close();
      await Cat.setPW({
        email: 'water',
        pw: 'new-pw-who-dis',
      });
    } catch (e) {
      expect(e.message).toBe(
        'Error: MongoNotConnectedError: Client must be connected before running operations'
      );
    } finally {
      await TestMongoClient.connect();
    }
  });
});
