const articesRouter = require('express').Router()
const { getArticles, getArticleById, patchArticleById } = require('../controllers/articles.controller')
const { getCommentsByArticleId} = require('../controllers/comments.controller')
const { postComment } = require('../controllers/comments.controller')
articesRouter.get('/', getArticles)

articesRouter
.route('/:article_id')
.get(getArticleById)
.patch(patchArticleById)


articesRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postComment)



module.exports = articesRouter