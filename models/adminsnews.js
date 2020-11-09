'use strict';
module.exports = (sequelize, DataTypes) => {
    const AdminNews = sequelize.define('admin_News', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      role: {
        type: DataTypes.STRING
      }
    }, {});
    return AdminNews;
};