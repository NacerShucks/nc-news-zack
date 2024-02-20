const { insertComment } = require("../modules/comments.modules")

exports.postComment = (req, res, next) => {
    console.log(req.params);
    insertComment(req.body, req.params.article_id)
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}