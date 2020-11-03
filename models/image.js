const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Image = sequelize.define("image",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fieldname: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    originalname: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    destination: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    filename: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    path: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    size: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})




module.exports = Image;