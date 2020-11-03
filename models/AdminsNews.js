const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const AdminsNews = sequelize.define('AdminsNews', {
    role: {
        type: Sequelize.STRING(255),
        allowsNull: false
    }
});
AdminsNews.removeAttribute('id');


module.exports = AdminsNews