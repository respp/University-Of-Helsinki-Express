const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

//Start the server
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
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

//Delete
blogsRouter.delete('/:id', async(req,res) =>{
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

//Put
blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    // title: body.title,
    // author: body.author,
    // url: body.url,
    likes: body.likes,//4.14 update likes
  }
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
    // console.log('UPDATEDBLOG', updatedBlog);
    res.json(updatedBlog);
  
})

//Post
blogsRouter.post('/', async (req, res, next) => {
    const body = req.body

    const user = await User.findById(body.userId)
    // const user = await User.findById(body.id)
    // console.log('USER', user)
    console.log('BODY', body.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      // user: user.id
    })
    // console.log('EL REQ BODY ES: ', body)
      const savedBlog = await blog.save()
      // user.blogs = user.blogs.concat(savedBlog._id)
      // await user.save()

      res.status(201).json(savedBlog)

  })

module.exports = blogsRouter
