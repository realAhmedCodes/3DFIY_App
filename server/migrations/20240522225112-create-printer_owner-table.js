"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("printer_owner", {
      printer_owner_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "User", // Name of the table being referenced
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
      quality_certificate: {
        type: Sequelize.BLOB,
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
    await queryInterface.dropTable("printer_owner");
  },
};
