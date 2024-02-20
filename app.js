const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics.controller')
const { handleInvalidEndpoint, handleInternalServerError, handlePSQLErrors, handleCustomErrors } = require('./controllers/errors.controller')
const { getEndpoints } = require('./controllers/endpoints.controller')
const { getArticle } = require('./controllers/articles.controller')
const { getCommentsByArticleId } = require('./controllers/comments.controller')



app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.get('/api/articles/:article_id', getArticle)

app.all('/api/*', handleInvalidEndpoint)

app.use(handlePSQLErrors)

app.use(handleCustomErrors)

app.use(handleInternalServerError)

module.exports = app;