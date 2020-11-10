const { body } = require('express-validator');
const db = require('../migrator');

module.exports = () => 
    [
        body('firstname','The first name must not be empty')
            .trim()
            .notEmpty(),
        body('lastname', 'The last name must not be empty')
            .trim()
            .notEmpty(),
        body('email', 'Please enter a valid email')
            .trim()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
    ]
