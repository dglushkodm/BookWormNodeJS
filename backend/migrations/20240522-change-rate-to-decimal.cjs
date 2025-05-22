'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Books', 'rate', {
      type: Sequelize.DECIMAL(3,1),
      allowNull: true,
      defaultValue: null
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Books', 'rate', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    });
  }
}; 