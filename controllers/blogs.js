const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//jsonwebtoken
const getTokenFrom = req =>{
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

//Start the server
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)  //transformando a json
})

//individual blog
blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

//all comments in a blog
blogsRouter.get('/:id/comments', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    res.json(blog.comments)
  } else {
    res.status(404).end()
  }
})

//Delete
blogsRouter.delete('/:id', async(req,res) =>{
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
    likes: body.likes,//4.14 update likes
  }
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
    // console.log('UPDATEDBLOG', updatedBlog);
    res.json(updatedBlog);
  
})

//Post a blog
blogsRouter.post('/', async (req, res) => {
    const body = req.body

    // const user = await User.findById(body.userId)
    // const user = await User.findOne({}) 4.17

    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
      description: body.description
    })

    console.log(blog)

    const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()

      res.status(201).json(savedBlog)

  })

  //Post a comment
  blogsRouter.post('/:id/comments', async (request, response) => {
    const blogId = request.params.id;
    const comment = request.body.comment;
  
    if (!comment) {
      return response.status(400).json({ error: 'Comment content missing' });
    }
  
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' });
    }
  
    blog.comments = blog.comments.concat(comment);
    await blog.save();
  
    response.status(201).json(blog);
  });

  module.exports = blogsRouter
