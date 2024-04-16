const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

//Initializations
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' https:; font-src 'self' https://university-of-helsinki-fullstack-node-y.onrender.com/");
  next();
});


  //Settings
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

//Middlewares
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(morgan('tiny'))

//Start the server
  app.get('/api/persons', (req, res) => {
    Person.find({})
    .then(persons => {
      res.json(persons)
    })
  })

  app.get('/api/persons/:id',(req, res, next)=>{
    Person.findById(req.params.id)
    .then(person => {
      if (person){
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
  })



  app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
    .then((res)=>{
      res.status(204).end()
    })
    .catch(err => next(err))
  })

  const generateId = ()=>{
    const maxId = Math.random() * (100000 - 4) + 4
    return Math.floor(maxId)
  }

  app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if(!body.name){
        return res.status(400).json({
            error: 'name missing'
        })
    }
    if(!body.number){
        return res.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Person({
        // id: generateId(),
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson =>{
      console.log(person)
      res.json(savedPerson)
    })
    .catch(err=>next(err))
})

app.put('/api/persons/:id', (req, res, next) =>{
  const body = req.body

  const person = {
    // id: generateId(),
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { 
    new:true,
    runValidators: true
  })
  .then(savedPerson =>{
    res.json(savedPerson)
  })
  .catch(err => next(err))

})

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ err: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ err: err.message })
  }

  next(err)
}
// este debe ser el último middleware cargado
app.use(errorHandler)