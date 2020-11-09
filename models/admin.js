const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const News = require('./news');
const AdminsNews = require('./AdminsNews');


const Admin = sequelize.define('admins', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true

    },
    firstname: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    lastname: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail:true
          }
    },
    password: {
        type: Sequelize.STRING(64),
    },
    role: {
        type: Sequelize.STRING(64),
        allowNull: false,
        default: 'I am new'
    },
    isActive: {
        type: Sequelize.BOOLEAN(),
        allowNull: false
    },
    isConfirmed: {
        type: Sequelize.BOOLEAN(),
        allowNull: false
    }
});
Admin.belongsToMany(News, { through: AdminsNews });
module.exports = Admin