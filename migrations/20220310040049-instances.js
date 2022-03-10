"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("instances", {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      project_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "projects",
          },
          key: "id",
        },
        allowNull: false,
      },
      project_version_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: "project_versions",
          },
          key: "id",
        },
        allowNull: true,
      },
      data: Sequelize.DataTypes.JSON,
      name: Sequelize.DataTypes.STRING,
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
    await queryInterface.dropTable("instances");
  },
};
