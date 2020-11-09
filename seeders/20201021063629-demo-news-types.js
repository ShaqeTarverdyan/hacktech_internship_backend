'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('news_types', [
      {
        name: 'Sport',
        value: 'sport',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Music',
        value: 'music',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Politic',
        value: 'politic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
  ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('news_types', null, {});
  }
};
