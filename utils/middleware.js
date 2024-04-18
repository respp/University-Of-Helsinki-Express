const logger = require('./logger')

const errorHandler = (err, req, res, next) => {
    logger.error(err.message)
  
    if (err.name === 'CastError') {
      return res.status(400).send({ err: 'malformatted id' })
    } else if (err.name === 'ValidationError') {
      return res.status(400).json({ err: err.message })
    }
  
    next(err)
  }

  module.export = {
    errorHandler
  }