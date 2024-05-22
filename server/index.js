const PORT = process.env.PORT || 8000;

const express = require("express")

const cors = require("cors")
const app= express()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const sequelize = require("./sequelize");
//Routes imports
const userRouter = require("./Routes/users.js");

// Server Setup
app.use(cors())
app.use(express.json())
app.use("/usersApi", userRouter);


app.get("/", (req, res) => {
  res.send("Welcome to the root path!");
});
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });