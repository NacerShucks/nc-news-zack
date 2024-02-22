const { selectArticleById, selectArticles, updateArticle } = require("../models/articles.models")
const { selectTopics } = require("../models/topics.models")

exports.getArticles = (req, res, next) => {
    Promise.all([selectArticleById({ article_id: 1}), selectTopics(req.query)])
    .then((promiseResolutions) => {
        const articleKeys = Object.keys(promiseResolutions[0][0])
        const topics = promiseResolutions[1]
        selectArticles(req.query, topics, articleKeys)
        .then((articles) => {
            res.status(200).send(articles)
        })
        .catch((err) => {
            next(err)
        })
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

