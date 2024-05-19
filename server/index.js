const PORT = process.env.PORT || 8000;

const express = require("express")

const cors = require("cors")
const app= express()
const bcrypt= require("bycrpt")
const jwt = require("jsonwebtoken")

//Routes imports


// Server Setup
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Welcome to the root path!");
});
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});