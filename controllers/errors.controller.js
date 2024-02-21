

exports.handleInvalidEndpoint = (req, res, next) => {
    res.status(404).send('Not Found')
}

exports.handleInternalServerError = (err, req, res, next) => {
    res.status(500).send({msg: 'Internal Server Error'})
}

exports.handlePSQLErrors = (err, req, res, next) => {
    if(err.code === '22P02' || err.code === '22003'){
        res.status(400).send({msg: 'Bad Request'})
    }
    next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
}