const express = require('express')
const app = express()

const { handleInvalidEndpoint, handleInternalServerError, handlePSQLErrors, handleCustomErrors } = require('./controllers/errors.controller')

const apiRouter = require('./routers/api.router')

app.use(express.json())

app.use('/api', apiRouter)

app.all('/*', handleInvalidEndpoint)

app.use(handlePSQLErrors)

app.use(handleCustomErrors)

app.use(handleInternalServerError)

module.exports = app;