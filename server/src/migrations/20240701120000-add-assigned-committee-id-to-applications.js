"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Applications", "assigned_committee_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Committees",
        key: "committee_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Applications", "assigned_committee_id");
  },
};
