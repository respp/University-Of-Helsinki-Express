const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

//Start the server
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)  //transformando a json
})

//Delete
blogsRouter.delete('/:id', async(req,res,next) =>{
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

//Put
blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    // console.log('UPDATEDBLOG', updatedBlog);
    res.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
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
