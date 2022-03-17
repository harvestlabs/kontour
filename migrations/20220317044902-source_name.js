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
      "source_name",
      Sequelize.DataTypes.STRING
    );
    await queryInterface.addColumn(
      "local_contract_sources",
      "type",
      Sequelize.DataTypes.INTEGER
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("local_contract_sources", "source_name");
    await queryInterface.removeColumn("local_contract_sources", "type");
  },
};
