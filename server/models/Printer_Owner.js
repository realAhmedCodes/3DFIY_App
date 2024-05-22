const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // Make sure this path is correct
const User = require("../models/User"); // Assuming this path is correct

const Printer_Owner = sequelize.define("Printer_Owner", {
  printer_owner_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  cnic_number: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  cnic_pic: {
    type: DataTypes.BLOB,
    allowNull: false,
  },
  bio: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ratings: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  quality_certificate: {
    type: DataTypes.BLOB, // Use DataTypes.BLOB for storing binary data like documents and pictures
    allowNull: true,
  },
});

// Establish relationships if not already defined
Printer_Owner.belongsTo(User, { foreignKey: "user_id" });

module.exports = Printer_Owner;
