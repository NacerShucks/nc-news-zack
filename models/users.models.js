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

exports.selectUser = ({username}) => {
    const queryString = format(`SELECT username,
                        name,
                        avatar_url
                        FROM users
                        WHERE username = %L`,
                        username 
                        )
    return db.query(queryString)
    .then(({rows}) => {
        if(rows[0] === undefined){
            return Promise.reject({status: 404, msg : 'Not Found'})
        } 
        return rows[0]
    })
}