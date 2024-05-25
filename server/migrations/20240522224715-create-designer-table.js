"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Designers", {
      designer_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      cnic_number: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
      },
      cnic_pic: {
        type: Sequelize.BLOB,
        unique: true,
        allowNull: false,
      },
      bio: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ratings: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Designers");
  },
};
