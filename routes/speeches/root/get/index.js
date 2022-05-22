const { GLOBAL_STATE } = require('./../../../../global')

async function getSpeeches(req, res, next) { 
  try {
    const dbRes = await GLOBAL_STATE.Collections.Speeches.readMany()
    return res.status(200).json(dbRes)
  } catch (error) {
    console.log('getSpeeches Error:')
    console.log(error)
    return res.status(500).json({ Error: 'get Speeches error' });
  }
}

module.exports = getSpeeches;