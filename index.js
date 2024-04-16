const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')


//Settings
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

// const errorHandler = (err, req, res, next) => {
//   logger.error(err.message)

//   if (err.name === 'CastError') {
//     return res.status(400).send({ err: 'malformatted id' })
//   } else if (err.name === 'ValidationError') {
//     return res.status(400).json({ err: err.message })
//   }

//   next(err)
// }
// // este debe ser el último middleware cargado
// app.use(errorHandler)