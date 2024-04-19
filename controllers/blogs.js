const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

//Start the server
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)  
})

//Post
blogsRouter.post('/', (req, res, next) => {
    const blog = new Blog(req.body)
  
    blog
      .save()
      .then(result => {
        res.status(201).json(result)
      })
      .catch(err=>next(err))
  })

module.exports = blogsRouter
