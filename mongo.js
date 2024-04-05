const mongoose = require('mongoose')

//Verificaciones
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
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length<4) {
    console.log('phonebook:')
    Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
  } else if (process.argv.length == 5){
    // Creando ojeto
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

//salvando objeto con el metodo save()
    person.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook `)
        mongoose.connection.close() 
    })
  } else if (process.argv.length == 4){
    console.log('give number as argument')
    process.exit(1)
  }







