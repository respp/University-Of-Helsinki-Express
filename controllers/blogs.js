const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

//Start the server
blogsRouter.get('/', (req, res) => {
    Blog.find({})
    .then(blogs => {
      res.json(blogs)
      console.log('Get', blogs)
    })
    .catch(err=>{
      console.error('Error 404 papa', err)
    })
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
