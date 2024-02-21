const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics.controller')
const { handleInvalidEndpoint, handleInternalServerError, handlePSQLErrors, handleCustomErrors } = require('./controllers/errors.controller')
const { getEndpoints } = require('./controllers/endpoints.controller')
const { getArticles, getArticleById } = require('./controllers/articles.controller')



app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/', getArticles)

app.get('/api/articles/:article_id', getArticleById)

app.all('/api/*', handleInvalidEndpoint)

app.use(handlePSQLErrors)

app.use(handleCustomErrors)

app.use(handleInternalServerError)

module.exports = app;