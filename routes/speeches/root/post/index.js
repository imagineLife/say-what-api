const { GLOBAL_STATE: { Collections } } = require('./../../../../global');

async function postASpeech(req, res, next) {
  try { 
    const { orator, text, date } = req.body;
    console.log({ orator, text, date });
    
    console.log('Collections.Speeches')
    console.log(Collections.Speeches)
    
    let dbRes = await Collections.Speeches.createOne({
      orator, text, date
    })
    console.log('dbRes')
    console.log(dbRes)
    
    return res.status(200).json('success')
  } catch (e) {
    console.log('post speeches Error')
    console.log(e.message)
    return res.status(500).json({Error: 'Server error'});
  }
}

module.exports = postASpeech;