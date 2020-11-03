const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Types = sequelize.define("types", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    value: {
        type: Sequelize.STRING(255),
        allownull: false
    }
});

module.exports = Types;