function getById(req, res, next) { 
  return res.status(200).json(`getById: ${req.params.userId}`)
}

module.exports = getById;