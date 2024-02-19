const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics.controller')



app.get('/api/topics', getTopics)



app.all('/api/*', (req, res, next) => {
    res.status(404).send('Not Found')
})

app.use((err, req, res, next) => {
    if (err.status && err.msg){
        console.log(err, '<------ app.use err');
        res.status(err.status).send({msg: err.msg})
    }else{
        res.status(400).send({msg: 'Bad Request'})
    }
})


module.exports = app;