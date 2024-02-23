const commentsRouter = require('express').Router()
const { deleteComments } = require('../controllers/comments.controller')

commentsRouter.delete('/:comment_id', deleteComments)

module.exports = commentsRouter