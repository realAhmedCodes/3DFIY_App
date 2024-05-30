const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Like = sequelize.define("Like", {
  like_id: {
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
  },
  liked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Sets default like value to true
  },
  
});

module.exports = Like;
