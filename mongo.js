const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.rmqbhi0.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

// Schema
const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

// Crear y guardar objetos:Son funciones constructoras que crean nuevos objetos JavaScript
// const person = new Person({
// //   id: 122312312321,  
//   name: 'Renzo',
//   number: '1234'
// })

// //salvando objeto con el metodo save()
// person.save().then(result => {
//   console.log('person saved!')
//   mongoose.connection.close() 
// })

Person.find({number:1234}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })