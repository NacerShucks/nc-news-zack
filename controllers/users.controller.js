const { selectUsers, selectUser } = require("../models/users.models")



exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({users})
    })
}

exports.getUserByUsername = (req, res, next) => {
    selectUser(req.params)
    .then((user) => {
        res.status(200).send(user)
    })
    .catch((err) => {
        next(err)
    })
}