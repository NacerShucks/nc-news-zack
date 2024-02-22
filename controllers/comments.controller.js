
const { insertComment, removeComments } = require("../models/comments.models")
const { selectArticleById } = require("../models/articles.models")
const { requestComments } = require("../models/comments.models")

exports.postComment = (req, res, next) => {
    insertComment(req.body, req.params.article_id)
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}


exports.getCommentsByArticleId = (req, res, next) => {
    Promise.all([requestComments(req.params), selectArticleById(req.params)])
    .then((promiseResolutions) => {
        if(promiseResolutions[1].length === 0){
            return Promise.reject({status: 404, msg : 'Not Found'})
        }
        res.status(200).send({comments: promiseResolutions[0]})
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteComments = (req, res, next) => {
    removeComments(req.params)
    .then(() => {
        res.status(201).send()
    })
    .catch(next)
}