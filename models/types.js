'use strict';
module.exports = (sequelize, DataTypes) => {
    const Types = sequelize.define('news_types', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    }, {});
    Types.associate = function(models) {
      Types.hasMany(models.news, {
          foreignKey : 'type_id',
      });
    };
    return Types;
};
