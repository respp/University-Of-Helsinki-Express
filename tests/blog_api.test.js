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
    
    const res = await api.get('/api/blogs')
    assert(res.body.length == 2)
    console.log('EL ASSERT',res.body.length == 2)
    })

after(async () => {
  await mongoose.connection.close()
})