// npm test -- tests/blog_api.test.js
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const Blog = require('../models/blog')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const api = supertest(app)
const initialBlogs = require('./test_helper').initialBlogs
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('when there is initially some blogs saved', () => {
  test('posts are returned as json', async () => {
    await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    })
  })


describe('basic blog functionalities', () => {  
  test('there are two notes', async () => {
    const res = await api.get('/api/blogs')
    assert(res.body.length == initialBlogs.length)
    // console.log('EL ASSERT',res.body.length == initialBlogs.length)
    })

  test("Unique identifiers are called id", async()=>{
    const res = await api.get('/api/blogs')
    res.body.forEach(obj => {
        // console.log('id' in obj)
        assert('id' in obj, true)
      });
    })  
  })
  
  // describe('blog post', () => {  
  //   //401 Unauthorized
  //   test('a valid blog can be added', async()=>{
  //     const newBlog = {
  //       title: "async/await simplifies making async calls",
  //       author: "autor asincrono",
  //       url: "Nueva url.com",
  //       likes: 7890,
  //   }
    
  //     await api
  //       .post('/api/blogs')
  //       .send(newBlog)
  //       .expect(201)
  //       .expect('Content-Type', /application\/json/)
    
  //     const res = await api.get('/api/blogs')   
  //     const titles = res.body.map(x => x.title)    
  //     // console.log('TITLE ',titles)    
  //     assert(res.body.length, initialBlogs.length + 1)
  //     assert(titles.includes('async/await simplifies making async calls'))
  //   })
  // })

  describe('deletion of a new blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      // console.log('BLOGSTODELETE ',blogToDelete.id)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert(blogsAtEnd.length, initialBlogs.length - 1)

      const titles = blogsAtEnd.map(r => r.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })
    describe('viewing a specific note', () => {
      test('succeeds with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]
        
        const resultBlog = await api.get(`/api/blogs/${blogsAtStart[0].id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        // console.log('BLOGS AT START ',blogsAtStart)
        // console.log('RESULT BLOG BODY ',resultBlog.body)
  
        assert.deepStrictEqual(resultBlog.body, blogToView)
      })
      test('fails with statuscode 404 if blog does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()
  
        await api
          .get(`/api/blogs/${validNonexistingId}`)
          .expect(404)
      })
    })
    describe('when there is initially one user in db', () => {
      beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
    
        await user.save()
      })
    
      test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'mluukkai',
          name: 'Matti Luukkainen',
          password: 'salainen',
        }
    
        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
      })
      test.only('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users/')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        // console.log('CONSOLE LOG', result.body)
        assert(result.body.error.includes('expected `username` to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
    })

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})