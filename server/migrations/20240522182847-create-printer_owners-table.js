"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PrinterOwners", {
      printer_owner_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // assuming the table name for the User model is 'Users'
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
        type: Sequelize.BLOB, // Use Sequelize.BLOB for storing binary data like documents and pictures
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("PrinterOwners");
  },
};
