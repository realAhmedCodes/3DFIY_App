const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Designer = require("../models/Designer");
const PrinterOwner = require("../models/Printer_Owner");

router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      location,
      profile_pic,
      phoneNo,
      cnic_number,
      cnic_pic,
      sellerType,
      bio,
    } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      location,
      profile_pic,
      phoneNo,
      sellerType,
    });

    let seller;
    if (sellerType === "Designer") {
      seller = await Designer.create({
        user_id: newUser.user_id,
        cnic_number,
        cnic_pic,
        bio,
      });
    } else if (sellerType === "Printer Owner") {
      seller = await PrinterOwner.create({
        user_id: newUser.user_id,
        cnic_number,
        cnic_pic,
        bio,
      });
    }

    res.status(201).json({
      message: "User and Seller created successfully",
      data: { newUser, seller },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ detail: "User does not exist!" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      let sellerId = null;
      let tokenPayload = {
        user_id: user.user_id,
        email: user.email,
        sellerType: user.sellerType,
      };

      if (user.sellerType === "Designer") {
        const designer = await Designer.findOne({
          where: { user_id: user.user_id },
        });
        sellerId = designer ? designer.designer_id : null;
        tokenPayload.user_id = sellerId;
      } else if (user.sellerType === "Printer Owner") {
        const printerOwner = await PrinterOwner.findOne({
          where: { user_id: user.user_id },
        });
        sellerId = printerOwner ? printerOwner.printerOwner_id : null;
        tokenPayload.user_id = sellerId;
      }

      const token = jwt.sign(
        tokenPayload,
        `${process.env.ACCESS_TOKEN_SECRET}`,
        {
          expiresIn: "1hr",
        }
      );

      res.json({ email: user.email, token });
    } else {
      res.status(401).json({ detail: "Login failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: "Internal Server Error" });
  }
});

router.get("/designers", async (req, res) => {
  try {
    const category = await Designer.findAll({
      order: [["createdAt", "DESC"]],
      
    });
    res.json(category); 
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




router.get("/users", async (req, res) => {
  try {
    const category = await User.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
    });
    res.json(category); // Return 'categories' instead of 'category'
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
