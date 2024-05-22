//Sequelize file
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const env = process.env.NODE_ENV || "development";

// Load configuration from config.json
const configPath = path.join(__dirname, 'config', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))[env];

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: config.dialect || "postgres",
    logging: config.logging // Use logging configuration from config file
  }
);

module.exports = sequelize;
