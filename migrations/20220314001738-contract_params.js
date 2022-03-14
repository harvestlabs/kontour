"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      "contracts",
      "constructor_params",
      Sequelize.DataTypes.JSON
    );
    await queryInterface.addColumn(
      "contracts",
      "instance_id",
      Sequelize.DataTypes.STRING
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("contracts", "constructor_params");
    await queryInterface.removeColumn("contracts", "instance_id");
  },
};
