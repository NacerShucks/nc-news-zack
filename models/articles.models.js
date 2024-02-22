const db = require('../db/connection.js')
const format = require('pg-format')

exports.selectArticleById = (id) => {
    const articleId = Number(id.article_id)
    const queryString = 'SELECT * FROM articles WHERE article_id=$1'
    return db.query(queryString, [articleId])
    .then(({rows}) => {
        return rows
    })
}

exports.selectArticles = () => {
    const queryString = `SELECT articles.author, 
                                title,
                                articles.article_id, 
                                topic, 
                                articles.created_at,
                                articles.votes,
                                article_img_url,
                                COUNT(comments.article_id) AS comment_count
                                FROM articles
                                LEFT JOIN comments 
                                ON articles.article_id = comments.article_id 
                                GROUP BY articles.article_id
                                ORDER BY articles.created_at DESC`
    return db.query(queryString)
    .then(({rows}) => {
        return rows
    })
}

exports.updateArticle = (params, updateBody) => {
    const articleId = Number(params.article_id)
    if(typeof updateBody.inc_votes !== 'number' || !Object.keys(updateBody).includes('inc_votes') || typeof articleId !== 'number' ){
        return Promise.reject({status: 400, msg: 'Bad Request'})
    }
    const queryString = format(`UPDATE articles SET votes = votes + %L WHERE article_id = %L RETURNING *`,
                                updateBody.inc_votes,
                                params.article_id)
    return db.query(queryString)
    .then((result) => {
        return result.rows
    })
}