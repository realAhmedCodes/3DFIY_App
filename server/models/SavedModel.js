const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const SavedModel = sequelize.define("SavedModel", {
  saved_model_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  model_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Models",
      key: "model_id",
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "user_id",
    },
    saved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, 
    },
  },
});

module.exports = SavedModel;
