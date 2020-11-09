'use strict';
module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define('news_file', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      fieldname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      originalname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {});
      File.associate = function(models) {
        File.belongsTo(models.news, {
            foreignKey : 'news_id',
        });
      };
    return File;
};
