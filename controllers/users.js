const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', {title:1, author:1, url: 1, likes:1})
    // , 
    // console.log(users)
    res.json(users)  //transformando a json
  })  

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

   // Validación de campos requeridos
   if (!name || name.trim() === "") {
    return response.status(400).json({ error: 'El campo "name" es requerido.' });
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter