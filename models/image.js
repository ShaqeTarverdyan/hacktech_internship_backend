'use strict';
module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('news_image', {
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
    Image.associate = function(models) {
      Image.belongsTo(models.news, {
          foreignKey : 'news_id',
      });
    };
    return Image;
};