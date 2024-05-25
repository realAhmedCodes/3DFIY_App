const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // Ensure this path is correct based on your project structure

const Category = sequelize.define(
  "Category",
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    parent_category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Category", // Make sure this is the same as the table name defined in the migration
        key: "category_id",
      },
      allowNull: true, // Allow NULL values for the root category
    },
    name: {
      type: DataTypes.STRING(50),
      unique: false,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Category", // Ensure this matches the table name in your migration
  }
);

module.exports = Category;
