const { getEndpoints } = require('../controllers/endpoints.controller')
const articesRouter = require('../routers/articles.router')
const commentsRouter = require('../routers/comments.router')
const topicsRouter = require('../routers/topics.router')
const userRouter = require('../routers/user.router')

const apiRouter = require('express').Router()

apiRouter.get('/', getEndpoints)

apiRouter.use('/users', userRouter)

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/comments', commentsRouter)

apiRouter.use('/articles', articesRouter)

module.exports = apiRouter