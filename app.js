const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics.controller')
const { notFound, internalServerError } = require('./controllers/errors.controller')
const { getEndpoints } = require('./controllers/endpoints.controller')



app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)


app.all('/api/*', notFound)

app.use(internalServerError)

module.exports = app;