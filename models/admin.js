'use strict';
module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('admin', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        firstname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        isConfirmed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        }
    }, {});
    Admin.associate = function(models) {
      Admin.belongsToMany(models.news, {
        foreignKey: 'admin_id',
        through: 'admin_News'
      })
    };
    return Admin;
};