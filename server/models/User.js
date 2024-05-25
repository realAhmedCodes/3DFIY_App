// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  profile_pic: {
    type: DataTypes.BLOB("long"),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phoneNo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  sellerType: {
    type: DataTypes.STRING(50),
    allowNull: false,
  }
});

module.exports = User;
