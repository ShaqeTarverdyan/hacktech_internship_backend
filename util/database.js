const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DB_SCHEMA, process.env.ADMIN, process.env.PASSWORD, {
    dialect: 'mysql', 
    host: '127.0.0.1'
});

module.exports = sequelize;