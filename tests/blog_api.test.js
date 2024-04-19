const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')

const api = supertest(app)

  test.only('posts are returned as json', async () => {
    await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    })
  
  test.only('there are two notes', async () => {
    const res = await api.get('/api/blogs')
    assert(res.body.length == 2)
    // console.log('EL ASSERT',res.body.length == 2)
    })

  test.only("Unique identifiers are called id", async()=>{
    const res = await api.get('/api/blogs')
    res.body.forEach(obj => {
      console.log('id' in obj)
      assert('id' in obj, true)
    });

  })  
  

after(async () => {
  await mongoose.connection.close()
})