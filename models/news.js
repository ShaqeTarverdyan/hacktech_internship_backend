
'use strict';
module.exports = (sequelize, DataTypes) => {
    const News = sequelize.define('news', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {});
    News.associate = function(models) {
      News.hasMany(models.news_file, {
          foreignKey : 'news_id',
      });
      News.hasMany(models.news_image, {
          foreignKey : 'news_id',
      });
      News.belongsTo(models.news_types, {
        foreignKey : 'type_id',
    });
      News.belongsToMany(models.admin, {
        foreignKey: 'news_id',
        through: 'admin_News'
      })
    };
    return News;
};

