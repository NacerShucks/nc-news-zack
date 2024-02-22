const db = require('../db/connection.js')
const format = require('pg-format');

exports.selectUsers = () => {
    const queryString = `SELECT username,
                                name,
                                avatar_url
                                FROM users`
    return db.query(queryString)
    .then(({rows}) => {
        return rows
    })
}