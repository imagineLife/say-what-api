const { Crud } = require('.');
const { setupDB } = require('../../server-setup');

describe('Crud Model', () => {
  let TestMongoClient;
  let TestSayWhat;
  let Cat;
  let testCreatedObject;
  const DB_NAME = 'TestSayWhat';
  const COLL_NAME = 'TestCollection';
  const dbObj = {
    host: 'localhost',
    port: '27017',
  };
  beforeAll(async () => {
    process.env.MONGO_AUTH = false;
    TestMongoClient = await setupDB({ ...dbObj });
    TestSayWhat = TestMongoClient.registerDB(DB_NAME);
    Cat = new Crud({ db: TestSayWhat, collection: COLL_NAME });
  });

  afterAll(async () => {
    TestMongoClient = await setupDB({ ...dbObj });
    TestSayWhat = TestMongoClient.registerDB(DB_NAME);
    Cat = new Crud({ db: TestSayWhat, collection: COLL_NAME });
    await Cat.remove();
    await TestMongoClient.close();
  });

  it('returns an object from the nowUTC method', () => {
    const res = Cat.nowUTC();
    expect(typeof res).toBe('object');
  });

  it('Crud.collectionName matches input param', () => {
    expect(Cat.collectionName).toBe('TestCollection');
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

  describe('methods work with persistent object', () => {
    it('createOne', async () => {
      const testObj = { dog: 'horse' };
      testCreatedObject = await Cat.createOne(testObj);
      expect(Object.keys(testCreatedObject).toString()).toBe(
        'acknowledged,insertedId'
      );
      expect(testCreatedObject.acknowledged).toBe(true);
    });
    it('readOne', async () => {
      const testFoundObj = await Cat.readOne({
        _id: testCreatedObject.insertedId,
      });
      expect(testCreatedObject.insertedId.toString()).toBe(
        testFoundObj._id.toString()
      );
      expect(testFoundObj.dog).toBe('horse');
    });
    it('readMany', async () => {
      const testSecondObj = { cat: 'ralph' };
      await Cat.createOne(testSecondObj);
      const findManyRes = await Cat.readMany();
      expect(await findManyRes.length).toBe(2);
    });
    describe('updateOne', () => {
      const updateObj = { $set: { water: 'melon' } };
      let testUpdateRes;

      it('acknowledged === true', async () => {
        testUpdateRes = await Cat.updateOne(
          { _id: testCreatedObject.insertedId },
          updateObj
        );
        expect(testUpdateRes.acknowledged).toBe(true);
      });
      it('modifiedCount === 1', () => {
        expect(testUpdateRes.modifiedCount).toBe(1);
      });
      it('upsertedId === null', () => {
        expect(testUpdateRes.upsertedId).toBe(null);
      });
      it('upsertedCount === 0', () => {
        expect(testUpdateRes.upsertedCount).toBe(0);
      });
      it('matchedCount === 1', () => {
        expect(testUpdateRes.matchedCount).toBe(1);
      });
      it('find obj and asserts updated key/val is present', async () => {
        const found = await await Cat.readOne({
          _id: testCreatedObject.insertedId,
        });
        expect(found.water).toBe('melon');
      });

      it('throws err without 2 obj params', async () => {
        try {
          await Cat.updateOne({ _id: testCreatedObject.insertedId });
        } catch (e) {
          expect(e.message).toBe(
            'Cannot call TestCollection.updateOne without 2 object params: 1 the find obj, 2 the update obj'
          );
        }
      });
    });
    describe('deleteOne', () => {
      describe('throws', () => {
        it('with no object parameter', async () => {
          try {
            await Cat.deleteOne();
          } catch (e) {
            expect(e.message).toBe(
              'Cannot call TestCollection.deleteOne without an object param'
            );
          }
        });
        it('with no "id" key in the obj param', async () => {
          try {
            await Cat.deleteOne({ horse: 'dog' });
          } catch (e) {
            expect(e.message).toBe(
              "Cannot call TestCollection.deleteOne without 'id' key"
            );
          }
        });
      });
      describe('works', () => {
        it('finds, deletes, can not find the record', async () => {
          // find one
          const deleteFoundObj = await Cat.readOne();
          expect(deleteFoundObj._id).toBeTruthy();

          const deletedObj = await Cat.deleteOne({ id: deleteFoundObj._id });
          expect(JSON.stringify(deletedObj)).toBe(
            JSON.stringify({ acknowledged: true, deletedCount: 1 })
          );
        });
      });
    });

    describe('drop', () => {
      it('calls "drop" on remove', async () => {
        const MOCK_RETURN = 'this is a dummy string';
        jest.spyOn(Cat.collection, 'drop').mockResolvedValueOnce(MOCK_RETURN);
        try {
          const testRes = await Cat.remove();
          expect(testRes).toBe(MOCK_RETURN);
        } catch (e) {
          console.log('drop test err');
          console.log(e.message);
        }
      });
    });
  });

  describe('errors throw when db is disconnected', () => {
    beforeAll(async () => {
      await TestMongoClient.close();
    });

    it('createOne', async () => {
      const testObj = { failable: 'obj' };

      try {
        await Cat.createOne(testObj);
      } catch (e) {
        expect(e.message).toBe(
          'MongoNotConnectedError: Client must be connected before running operations'
        );
      }
    });

    it('readOne', async () => {
      try {
        await Cat.readOne({ _id: testCreatedObject.insertedId });
      } catch (e) {
        expect(e.message).toBe(
          'MongoNotConnectedError: Client must be connected before running operations'
        );
      }
    });
    it('readOne', async () => {
      try {
        await Cat.readMany();
      } catch (e) {
        expect(e.message).toBe(
          'MongoNotConnectedError: Client must be connected before running operations'
        );
      }
    });
    it('updateOne', async () => {
      try {
        await Cat.updateOne(
          { _id: testCreatedObject.insertedId },
          { $set: { poiu: 'lkjh' } }
        );
      } catch (e) {
        expect(e.message).toBe(
          'MongoNotConnectedError: Client must be connected before running operations'
        );
      }
    });
    it('deleteOne', async () => {
      try {
        await Cat.deleteOne({ id: 'horse' });
      } catch (e) {
        expect(e.message).toBe(
          'MongoNotConnectedError: Client must be connected before running operations'
        );
      }
    });
    it('remove', async () => {
      try {
        await Cat.remove();
      } catch (e) {
        expect(e.message).toBe(
          'MongoNotConnectedError: Client must be connected before running operations'
        );
      }
    });
  });
});
