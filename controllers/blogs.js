const blogsRouter = require('express').Router()
const { request, response } = require('express')
const Blog = require('../models/blog')
const User = require('./../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const user = request.user

    const blog = new Blog({
        ...request.body,
        likes: request.body.likes || 0,
        user: user._id
    })

    const result = await blog.save()
    response.status(201).json(result)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (blog) {
        return response.json(blog)
    }

    response.status(404).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const user = request.user
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

    response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        const error = new Error('Resource not found')
        error.name = 'ResourceError'
        throw error        
    }

    if (blog.user.toString() != user._id.toString()) {
        const error = new Error('Unauthorized')
        error.name = 'TokenValidationError'
        throw error
    }

    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
})

module.exports = blogsRouter