const { selectArticleById, selectArticles, updateArticle } = require("../models/articles.models")

exports.getArticles = (req, res, next) => {
    selectArticles()
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
        if(article.length === 0){
            return Promise.reject({status: 404, msg : 'Not Found'})
        } 
        res.status(200).send({article: article[0]})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleById = (req, res, next) => {

    updateArticle(req.params, req.body)
    .then((article) => {
        console.log(article);
        if(article[0] === undefined){
            return Promise.reject({status: 404, msg : 'Not Found'})
        } 
        res.status(201).send({article: article[0]})
    })
    .catch((err) => {
        console.log(err);
        next(err)
    })

}

