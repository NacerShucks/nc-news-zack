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

exports.selectArticles = ({topic}) => {
    let topicString = ''
    if(topic){
        topicString = 'WHERE articles.topic = %L'
    }
    const queryString = format(`SELECT articles.author, 
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
                                ${topicString}
                                GROUP BY articles.article_id
                                ORDER BY articles.created_at DESC`,
                                topic)
    return db.query(queryString)
    .then(({rows}) => {
        if(rows[0] === undefined){
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return rows
    })
}

exports.updateArticle = (params, updateBody) => {
    let queryString = ''
    if (updateBody.inc_votes){
        queryString = format(`UPDATE articles SET votes = votes + %L WHERE article_id = %L RETURNING *`,
                                updateBody.inc_votes,
                                params.article_id)
    }else{
        queryString = format(`SELECT * FROM articles WHERE article_id = %L`,
                                params.article_id)
    }
    return db.query(queryString)
    .then((result) => {
        if(result.rows[0] === undefined){
            return Promise.reject({status: 404, msg : 'Not Found'})
        } 
        return result.rows
    })
}