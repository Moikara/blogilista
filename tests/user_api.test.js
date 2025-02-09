const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')

const User = require('../models/user')

const listHelper = require('../utils/list_helper')

const api = supertest(app)

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash(process.env.SECRET, 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('password is not returned', async () => {
        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const users = response.body

        users.forEach(user => assert.strictEqual(user.hasOwnProperty('passwordHash'), false))
    })

    describe('creation', () => {
        test('creation succeeds with a fresh username', async () => {
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
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = response.body

            assert.strictEqual(usersAtEnd.length, 2)
        })

        test('creation fails with a non-unique username', async () => {
            const newUser = {
                username: 'root',
                name: 'User',
                password: 'password',
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            const response = await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = response.body

            assert.strictEqual(usersAtEnd.length, 1)
        })

        test('creation fails with too short username', async () => {
            const newUser = {
                username: 'us',
                name: 'User',
                password: 'password',
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            const response = await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = response.body

            assert.strictEqual(usersAtEnd.length, 1)
        })

        test('fails with too short password', async () => {
            const newUser = {
                username: 'user',
                name: 'User',
                password: 'pa',
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            const response = await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = response.body

            assert.strictEqual(usersAtEnd.length, 1)
        })
    })

    describe('login', () => {
        beforeEach(async () => {
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
        })

        test('login is succeeds with proper credentials', async () => {
            const response = await api
                .post('/api/login')
                .send({ username: 'username', password: 'password' })
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.hasOwnProperty('token'), true)
        })

        test('login is fails with wrong username', async () => {
            const response = await api
                .post('/api/login')
                .send({ username: 'user', password: 'password' })
                .expect(401)

            assert(response.body.error.includes('invalid username or password'))
        })

        test('login is fails with wrong password', async () => {
            const response = await api
                .post('/api/login')
                .send({ username: 'username', password: 'pass' })
                .expect(401)

            assert(response.body.error.includes('invalid username or password'))
        })
    })
})

after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
})