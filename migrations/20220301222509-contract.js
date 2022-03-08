"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("contracts", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      address: Sequelize.DataTypes.STRING,
      name: Sequelize.DataTypes.STRING,
      abi: Sequelize.DataTypes.JSON,
      chain_id: Sequelize.DataTypes.INTEGER,
      node_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "nodes",
          },
          key: "id",
        },
        allowNull: false,
      },
      created_at: Sequelize.DataTypes.DATE,
      updated_at: Sequelize.DataTypes.DATE,
    });

    await queryInterface.createTable("contract_sources", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      address: Sequelize.DataTypes.STRING,
      abi: Sequelize.DataTypes.JSON,
      chain_id: Sequelize.DataTypes.INTEGER,
      name: Sequelize.DataTypes.STRING,
      source: Sequelize.DataTypes.STRING,
      created_at: Sequelize.DataTypes.DATE,
      updated_at: Sequelize.DataTypes.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("contract_sources");
    await queryInterface.dropTable("contracts");
  },
};
