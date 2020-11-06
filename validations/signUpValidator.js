const { body } = require('express-validator');
const Admin = require('../models/admin');


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
                .custom((value, { req }) => {
                    return Admin.findOne({email: value}).then(result => {
                        if(result) {
                            return Promise.reject("Email is already exists, Please pick a different email")
                        }
                    });
                }),
            body('password', 'The password must be at least 6 chars long')
                .trim()
                .isLength({ min: 6 })
                .notEmpty(),
            body('role', 'The role is required')
                .trim()
                .notEmpty()
        ]
