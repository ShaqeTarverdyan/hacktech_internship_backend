'use strict';
const bcrypt = require('bcrypt');

const hashedPassword = bcrypt.hashSync('111111', 10);
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('admins', [{
      firstname: 'Shaqe',
      lastname: 'Tarverdyan',
      email: 'tshaqe@gmail.com',
      password: hashedPassword,
      role: 'super',
      isActive: true,
      isConfirmed: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('admins', null, {});
  }
  
};
