"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("category", {
      category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      parent_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "category", // Self-referencing table
          key: "category_id",
        },
        onDelete: "CASCADE", // Optional: handle deletion of parent categories
        onUpdate: "CASCADE",
      },
      type: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
      },
      image: {
        type: Sequelize.BLOB,
        unique: true,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("category");
  },
};
