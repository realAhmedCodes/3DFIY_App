"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Category", {
      // Ensure the table name matches the model
      category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      parent_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Category", // Self-referencing table
          key: "category_id",
        },
        onDelete: "CASCADE", // Optional: handle deletion of parent categories
        onUpdate: "CASCADE",
      },
      name: {
        type: Sequelize.STRING(50),
        unique: false,
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
    await queryInterface.dropTable("Category");
  },
};
