'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';


const sequelize = new Sequelize('hackTech_intern', 'root', 'admin', {
    dialect: 'mysql', 
    host: '127.0.0.1',
    operatorsAliases: 0
});


const createModels = (sequelize) => {
    const db = {
      sequelize,
      Sequelize
    };
  
    fs.readdirSync(path.join(__dirname, "models")).filter((file) => {
      return file.indexOf(".") !== 0 && file.endsWith(".js");
    }).forEach((file) => {
      let model = sequelize["import"](path.join(__dirname, "models", file));
      db[model.name] = model;
    });
  
    Object.keys(db).forEach((model) => {
      if (db[model].associate) {
        db[model].associate(db);
      }
    });
  
    return db;
  };
  
  
  const mode = createModels(sequelize);
  module.exports = mode;



