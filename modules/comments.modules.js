const db = require('../db/connection.js')
const format = require('pg-format');

exports.insertComment = (comment, article_id) => {
    const commentClone = {
        author: comment.username,
        body: comment.body,
        article_id: article_id
    }
    const commentKeys = Object.keys(commentClone)
    const commentArr = commentKeys.map((key) => {
        return commentClone[key]
    })

    const queryString = format(
        `INSERT INTO comments (%I) 
        VAlUES (%L) 
        RETURNING 
                body, 
                votes, 
                author, 
                article_id, 
                created_at`,
        commentKeys,
        commentArr
    )
    console.log(queryString);
    return db.query(queryString)
    .then((result) => {
        return result.rows[0]
    })
    .catch((err) => {
        console.log(err);
        return Promise.reject({status: 400, msg: "bad request"});
    })
    
}