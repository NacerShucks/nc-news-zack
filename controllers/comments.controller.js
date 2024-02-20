const { selectArticleById } = require("../modules/articles.modules")
const { requestComments } = require("../modules/comments.modules")

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