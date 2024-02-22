const { selectArticleById, selectArticles, updateArticle } = require("../models/articles.models")

exports.getArticles = (req, res, next) => {
    
    selectArticles(req.query)
    .then((articles) => {
        res.status(200).send(articles)
    })
    .catch((err) => {
        next(err)
    })
} 


exports.getArticleById = (req, res, next) => {
    selectArticleById(req.params)
    .then((article) => {
        res.status(200).send({article: article[0]})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleById = (req, res, next) => {

    updateArticle(req.params, req.body)
    .then((article) => {
        
        res.status(201).send({article: article[0]})
    })
    .catch((err) => {
        next(err)
    })

}

