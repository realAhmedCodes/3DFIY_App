const PORT = process.env.PORT || 8000;

const express = require("express")
const path = require("path");
const cors = require("cors")
const app= express()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const sequelize = require("./sequelize");
//Routes imports
const userRouter = require("./Routes/users.js");
const categoryRouter= require("./Routes/category.js")
const modelRouter= require("./Routes/models.js")

// Server Setup
app.use(cors())
app.use(express.json())
app.use("/usersApi", userRouter);
app.use("/categoryApi", categoryRouter)
app.use("/modelApi", modelRouter)


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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