const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const listWithManyBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (blogA, blogB) => {
        if (blogB.likes > blogA.likes) {
            return blogB
        }

        return blogA
    }

    const favorite = blogs.reduce(reducer, blogs[0])

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    const reducer = (authorA, authorB) => {
        if (authorB.blogs > authorA.blogs) {
            return authorB
        }

        return authorA
    }

    let authors = []

    for (let i = 0; i < blogs.length; ++i) {
        const author = authors.find(element => element.author === blogs[i].author)
        if (author) {
            author.blogs = author.blogs + 1
        } else {
            authors.push({
                author: blogs[i].author,
                blogs: 1
            })
        }
    }

    return authors.reduce(reducer, authors[0])
}

const mostLikes = (blogs) => {
    const reducer = (authorA, authorB) => {
        if (authorB.likes > authorA.likes) {
            return authorB
        }

        return authorA
    }

    let authors = []

    for (let i = 0; i < blogs.length; ++i) {
        const author = authors.find(element => element.author === blogs[i].author)
        if (author) {
            author.likes = author.likes + blogs[i].likes
        } else {
            authors.push({
                author: blogs[i].author,
                likes: blogs[i].likes
            })
        }
    }

    return authors.reduce(reducer, authors[0])
}

module.exports = {
    listWithOneBlog,
    listWithManyBlogs,
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}