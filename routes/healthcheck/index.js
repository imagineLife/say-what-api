const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).send('server is up & running!');
});

module.exports = router;
