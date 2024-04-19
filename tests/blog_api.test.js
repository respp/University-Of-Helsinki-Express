const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('posts are returned as json', async () => {
    await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .then((res) => {
        expect(res.body).toHaveLength(2); // Cambia el número 2 por el valor esperado
    })
    })

after(async () => {
  await mongoose.connection.close()
})