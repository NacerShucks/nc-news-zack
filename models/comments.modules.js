const db = require('../db/connection.js')
const format = require('pg-format')

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