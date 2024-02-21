const db = require('../db/connection.js')

exports.selectTopics = () => {
    const queryString = `SELECT * FROM topics;`
    return db.query(queryString)
    .then((results) => {
        return results.rows
    })
}