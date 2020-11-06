const { body } = require('express-validator');

module.exports = () =>
[
    body('title', "The title must not be empty")
        .trim()
        .notEmpty(),
    body('content', "The content must not be empty")
        .trim()
        .notEmpty()
]