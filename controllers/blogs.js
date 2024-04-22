const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

//Start the server
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)  //transformando a json
})

//Post
blogsRouter.post('/', async (req, res, next) => {
    const blog = new Blog(req.body)
    // console.log('EL REQ BODY ES: ',req.body)
  
    // blog
    //   .save()
    //   .then(result => {
    //     res.status(201).json(result)
    //   })
    //   .catch(err=>next(err))
    try{
      const savedBlog = await blog.save()
      res.status(201).json(savedBlog)
    } catch(exception){
      next(exception)
    }
  })

module.exports = blogsRouter
