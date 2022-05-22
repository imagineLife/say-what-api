var router = require('express').Router()

router.get('/', function (req, res) {
  res.status(200).send('server is up & running!')
})

module.exports = router;