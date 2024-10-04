const config = require('./utils/config')
const express = require('express')
const compression = require('compression'); // Importa el middleware de compresión
const app = express()
require('express-async-errors')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to url', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
.then(()=>{
  logger.info('connected to MongoDB')
})
.catch(err=>{
  logger.error('error connecting to MongoDB', err.message)
})

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use(compression()); 
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
console.log(process.env.NODE_ENV)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports=app
