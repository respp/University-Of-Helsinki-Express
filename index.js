const express = require('express')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

//Initializations
const app = express()
app.use(cors())
app.use(express.json())

//Settings
const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//Start the server
app.get('/api/blogs', (req, res) => {
    Blog.find({})
    .then(blogs => {
      res.json(blogs)
    })
    .catch(err=>{
      console.log('Error 404 papa', err)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(err=>{
      console.log('segundo then papa 404')
    })
})