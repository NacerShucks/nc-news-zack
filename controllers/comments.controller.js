
const { insertComment } = require("../models/comments.models")
const { selectArticleById } = require("../models/articles.models")
const { requestComments } = require("../models/comments.models")

exports.postComment = (req, res, next) => {
    insertComment(req.body, req.params.article_id)
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}


exports.getCommentsByArticleId = (req, res, next) => {

    const {article_id} = req.params  

    Promise.all([requestComments(article_id), selectArticleById(article_id)])
    .then((promiseResolutions) => {
        res.status(200).send({comments: promiseResolutions[0]})
    })
    .catch((err) => {
        next(err)
    })
}