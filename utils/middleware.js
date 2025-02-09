const User = require('../models/user')
const logger = require('./logger')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')

    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.substring(7)
    }

    next()
}

const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        const error = new Error('Token invalid')
        error.name = 'TokenValidationError'
        throw error
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
        const error = new Error('Unauthorized')
        error.name = 'TokenValidationError'
        throw error
    }

    request.user = user

    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'ValidationError' || 'PasswordValidationError' || 'ResourceError') {
        return response.status(400).json({ error: error.message })
    }
    if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
    }
    if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: 'token missing or invalid' })
    }
    if (error.name === 'TokenValidationError') {
        return response.status(401).json({ error: error.message })
    }
    next(error)
}

module.exports = {
    errorHandler,
    tokenExtractor,
    userExtractor
}