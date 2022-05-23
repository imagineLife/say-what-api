const Oid = require('mongodb').ObjectId;
const {
  GLOBAL_STATE: { Collections },
} = require('../../../../global');

async function getById(req, res) {
  try {
    const { speechId } = req.params;
    const dbRes = await Collections.Speeches.readOne({ _id: Oid(speechId) });
    // eslint-disable-next-line no-underscore-dangle
    delete dbRes._id;
    return res.status(200).json(dbRes);
  } catch (e) {
    console.log('getById Error');
    console.log(e);
    return res.status(500).json({ Error: 'get speech by id' });
  }
}

module.exports = getById;
