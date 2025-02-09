const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const util = require('util');

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listHelper.listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('when list has many blogs equals the likes of that', () => {
        const result = listHelper.totalLikes(listHelper.listWithManyBlogs)
        assert.strictEqual(result, 36)
    })
})

describe('favorite', () => {
    test('most liked blog from the list', () => {
        const result = listHelper.favoriteBlog(listHelper.listWithManyBlogs)
        assert.strictEqual(util.isDeepStrictEqual(result, {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12,
        }), true)
    })
})

describe('most prolific', () => {
    test('author with most blogs', () => {
        const result = listHelper.mostBlogs(listHelper.listWithManyBlogs)
        assert.strictEqual(util.isDeepStrictEqual(result, {
            author: "Robert C. Martin",
            blogs: 3
        }), true)
    })
})

describe('most liked', () => {
    test('author with most likes', () => {
        const result = listHelper.mostLikes(listHelper.listWithManyBlogs)
        assert.strictEqual(util.isDeepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            likes: 17
        }), true)
    })
})