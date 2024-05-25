"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("model", {
      model_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Category",
          key: "category_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      designer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Designer",
          key: "designer_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      name: {
        type: Sequelize.STRING(50),
        unique: false,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(50),
        unique: false,
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_free: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      image: {
        type: Sequelize.BLOB("long"),
        allowNull: false,
      },
      model_file: {
        type: Sequelize.BLOB,
        allowNull: false,
      },
      likes_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      download_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable("model");
  },
};
