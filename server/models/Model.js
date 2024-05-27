// models/model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Category = require("./Category");
const Designer = require("./Designer");

const Model = sequelize.define("Model", {
  model_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: "category_id",
    },
  },
  designer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Designer,
      key: "designer_id",
    },
  },
  name: {
    type: DataTypes.STRING(50),
    unique: false,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(50),
    unique: false,
    allowNull: false,
  },
  price: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  is_free: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model_file: {
    type: DataTypes.BLOB("long"),
    allowNull: false,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  likes_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  download_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Model;
