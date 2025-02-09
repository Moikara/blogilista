const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
    const users = await User.find(request.params.id)
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (password.length < 3) {
        const error = new Error('Password too short')
        error.name = 'PasswordValidationError'
        throw error
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter