const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')

const api = supertest(app)

  test('posts are returned as json', async () => {
    await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    })
  
  test('there are two notes', async () => {
    const res = await api.get('/api/blogs')
    assert(res.body.length == 2)
    // console.log('EL ASSERT',res.body.length == 2)
    })

  test("Unique identifiers are called id", async()=>{
    const res = await api.get('/api/blogs')
    res.body.forEach(obj => {
        console.log('id' in obj)
        assert('id' in obj, true)
      });
    })  
  
    test.only('a valid blog can be added', async()=>{
      const newBlog = {
        "title": "async/await simplifies making async calls",
        "author": "autor asincrono",
        "url": "Nueva url.com",
        "likes": 7890
    }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const res = await api.get('/api/blogs')    
      const contents = res.body.map(x => x.content)    
      assert(res.body.length, initialNotes.length + 1)    
      assert(contents.includes('async/await simplifies making async calls'))
    })

after(async () => {
  await mongoose.connection.close()
})