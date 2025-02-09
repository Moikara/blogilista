const { test, after, beforeEach, describe, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const User = require('../models/user')

const listHelper = require('../utils/list_helper')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
    let auth

    before(async () => {
        const newUser = {
            username: 'username',
            name: 'User',
            password: 'password',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api
            .post('/api/login')
            .send({ username: 'username', password: 'password' })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        token = `Bearer ${response.body.token}`
    })


    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(listHelper.listWithManyBlogs)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .set('Authorization', token)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('blog objects have property id', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', token)

        const blogs = response.body

        blogs.forEach(blog => assert.strictEqual(blog.hasOwnProperty('id'), true))
    })

    test('all blogs are returned', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', token)

        assert.strictEqual(response.body.length, listHelper.listWithManyBlogs.length)
    })

    describe('addition of a new blog', () => {
        test('succeeds with valid data', async () => {
            const newBlog = {
                title: "Test",
                author: "Tester",
                url: "Asdf.Asdf",
                likes: 22
            }

            await api
                .post('/api/blogs')
                .set('Authorization', token)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api
                .get('/api/blogs')
                .set('Authorization', token)

            const blogsAtEnd = response.body
            assert.strictEqual(blogsAtEnd.length, listHelper.listWithManyBlogs.length + 1)

            const authors = blogsAtEnd.map(n => n.author)
            assert(authors.includes('Tester'))
        })

        test('fails with status code 400 if title is missing', async () => {
            const newBlog = {
                title: "",
                author: "Tester",
                url: "Asdf.Asdf",
                likes: 22
            }

            await api
                .post('/api/blogs')
                .set('Authorization', token)
                .send(newBlog)
                .expect(400)
        })

        test('fails with status code 400 if author is missing', async () => {
            const newBlog = {
                title: "Test",
                author: "",
                url: "Asdf.Asdf",
                likes: 22
            }

            await api
                .post('/api/blogs')
                .set('Authorization', token)
                .send(newBlog)
                .expect(400)
        })

        test('likes default to zero', async () => {
            const newBlog = {
                title: "Test",
                author: "Tester",
                url: "Asdf.Asdf",
            }

            const response = await api
                .post('/api/blogs')
                .set('Authorization', token)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blog = response.body

            assert.strictEqual(blog.likes, 0)
        })
    })

    describe('updating a blog', () => {
        test('succeeds with valid id', async () => {
            const Blog = {
                title: "Test",
                author: "Tester",
                url: "Asdf.Asdf",
            }

            const newBlog = {
                title: "Test",
                author: "Tester",
                url: "Asdf.Asdf",
                likes: 1
            }

            const response = await api
                .post('/api/blogs')
                .set('Authorization', token)
                .send(Blog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const id = response.body.id

            const updateResponse = await api
                .put(`/api/blogs/${id}`)
                .set('Authorization', token)
                .send(newBlog)
                .expect(200)

            const updatedBlog = updateResponse.body

            assert.strictEqual(updatedBlog.likes, 1)
        })
    })

    describe('deletion of a new blog', () => {
        test('succeeds with valid id', async () => {
            const newBlog = {
                title: "Test",
                author: "Tester",
                url: "Asdf.Asdf",
                likes: 22
            }

            const response = await api
                .post('/api/blogs')
                .set('Authorization', token)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const id = response.body.id

            await api
                .delete(`/api/blogs/${id}`)
                .set('Authorization', token)
                .expect(204)

            await api
                .get(`/api/blogs/${id}`)
                .set('Authorization', token)
                .expect(404)
        })
    })
})

after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
})
