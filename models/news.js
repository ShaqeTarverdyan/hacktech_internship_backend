const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const News = sequelize.define('news', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true

    }, 
    title: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    content: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    typeId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});


module.exports = News;
