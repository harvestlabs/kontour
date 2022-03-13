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
      "local_contract_sources",
      "bytecode",
      Sequelize.DataTypes.TEXT("medium")
    );
    await queryInterface.addColumn(
      "remote_contract_sources",
      "bytecode",
      Sequelize.DataTypes.TEXT("medium")
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("local_contract_sources", "bytecode");
    await queryInterface.removeColumn("remote_contract_sources", "bytecode");
  },
};
