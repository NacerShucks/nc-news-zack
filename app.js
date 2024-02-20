const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics.controller')
const { notFound, internalServerError } = require('./controllers/errors.controller')



app.get('/api/topics', getTopics)



app.all('/api/*', notFound)

app.use(internalServerError)

module.exports = app;