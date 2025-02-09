const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use('/api/login', loginRouter)
app.use(middleware.tokenExtractor)
app.use('/api/users', usersRouter)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)

app.use(middleware.errorHandler)

module.exports = app