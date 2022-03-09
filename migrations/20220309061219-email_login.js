"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("login_data", {
      user_id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        allowNull: false,
      },
      email: Sequelize.DataTypes.STRING,
      password: Sequelize.DataTypes.STRING,
      twitter_handle: Sequelize.DataTypes.STRING,
      github_handle: Sequelize.DataTypes.STRING,
      twitter_id: Sequelize.DataTypes.STRING,
      github_id: Sequelize.DataTypes.STRING,
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
    await queryInterface.dropTable("login_data");
  },
};
