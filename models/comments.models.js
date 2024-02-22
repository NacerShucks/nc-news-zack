const db = require('../db/connection.js')
const format = require('pg-format');
const { convertTimestampToDate } = require('../db/seeds/utils.js');

exports.requestComments = (articleID) => {
    const queryString = format(
        `SELECT * 
        FROM comments 
        WHERE comments.article_id = %L
        ORDER BY created_at DESC`, articleID)
    return db.query(queryString)
    .then((result) => {
        return result.rows
    })
}

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
    return db.query(queryString)
    .then((result) => {
        console.log(result);
        return convertTimestampToDate(result.rows[0])
    })
}