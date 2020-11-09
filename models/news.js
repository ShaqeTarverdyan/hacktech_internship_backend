const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const File = require('./file');
const Image = require('./image');

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


News.hasMany(File, { 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
News.hasMany(Image, { 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
});
  

module.exports = News;
