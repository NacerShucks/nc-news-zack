const db = require('../db/connection.js')
const format = require('pg-format')

exports.selectArticleById = (id) => {
    const queryString = `SELECT articles.author, 
                        title,
                        articles.body,
                        articles.article_id, 
                        topic, 
                        articles.created_at,
                        articles.votes,
                        article_img_url,
                        COUNT(comments.article_id) AS comment_count
                        FROM articles                  
                        LEFT JOIN comments 
                        ON articles.article_id = comments.article_id 
                        WHERE articles.article_id=$1
                        GROUP BY articles.article_id`
    return db.query(queryString, [id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows[0]
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
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return rows
    })
}

exports.updateArticle = (articleId, updateBody) => {
    if(typeof updateBody.inc_votes !== 'number' || !Object.keys(updateBody).includes('inc_votes')){
        return Promise.reject({status: 400, msg: 'Bad Request'})
    }

    const queryString = format(`UPDATE articles SET votes = votes + %L WHERE article_id = %L RETURNING *`,
                                updateBody.inc_votes,
                                articleId.article_id
                                )
                                
    return db.query(queryString)
    .then((result) => {
        if (result.rows.length === 0){
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return result.rows[0]
    })
    .catch((err) => {
        return Promise.reject(err)
    })
}