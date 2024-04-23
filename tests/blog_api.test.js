const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const Blog = require('../models/blog')

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

  test('posts are returned as json', async () => {
    await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    })
  
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
  
    test('a valid blog can be added', async()=>{
      const newBlog = {
        title: "async/await simplifies making async calls",
        author: "autor asincrono",
        url: "Nueva url.com",
        likes: 7890
    }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const res = await api.get('/api/blogs')   
      console.log(res.body)
      const titles = res.body.map(x => x.title)    
      // console.log('TITLE ',titles)    
      assert(res.body.length, initialBlogs.length + 1)
      assert(titles.includes('async/await simplifies making async calls'))
    })

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

    // describe('viewing a specific note', () => {

      test.only('succeeds with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]
        
        const resultBlog = await api.get(`/api/blogs/${blogToView.id}`)
        // .expect(200)
        // .expect('Content-Type', /application\/json/)
// npm test -- --test-only
        console.log('BLOGS AT START ',blogsAtStart)
        console.log('RESULT BLOG BODY PAPA ',resultBlog.body)
          console.log('== BLOG TO VIEW ',blogToView)
  
        assert.deepStrictEqual(resultBlog.body, blogToView)
      })
  
      test('fails with statuscode 404 if note does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()
  
        await api
          .get(`/api/notes/${validNonexistingId}`)
          .expect(404)
      })
  
      test('fails with statuscode 400 id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'
  
        await api
          .get(`/api/notes/${invalidId}`)
          .expect(400)
      })
    // })

after(async () => {
  await mongoose.connection.close()
})