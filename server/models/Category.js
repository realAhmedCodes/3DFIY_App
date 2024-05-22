// models/category.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // Assuming you have a database configuration file

const Category = sequelize.define("Category", {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  parent_category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Category",
      key: "category_id",
    },
    allowNull: true, // Allow NULL values for the root category
  },
  type: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  image: {
    type: DataTypes.BLOB,
    unique: true,
    allowNull: false,
  },
});

module.exports = Category;
