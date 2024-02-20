const { selectArticleById, selectArticles } = require("../modules/articles.modules")

exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
    if(article_id){
        selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({article})
        })
        .catch((err) => {
            next(err)
        })
    }else{
        selectArticles()
        .then((articles) => {
            res.status(200).send(articles)
        })
        .catch((err) => {
            next(err)
        })
    }

}