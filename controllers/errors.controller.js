

exports.handleInvalidEndpoint = (req, res, next) => {
    res.status(404).send('Not Found')
}

exports.handleInternalServerError = (err, req, res, next) => {
    res.status(500).send({msg: 'Internal Server Error'})
}

exports.handlePSQLErrors = (err, req, res, next) => {
    if(err.code === '22P02' || err.code === '23502' || err.code === '42601'){
        res.status(400).send({msg: 'Bad Request'})
    }
    if( err.code === '23503' ){
        res.status(404).send({msg: 'Not Found'})
    }
    next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
}