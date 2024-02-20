const { selectTopics } = require("../modules/topics.modules")


exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
}