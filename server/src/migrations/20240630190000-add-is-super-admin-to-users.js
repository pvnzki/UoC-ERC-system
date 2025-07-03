"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "is_super_admin");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "is_super_admin", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
};
