const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Designer = require("../models/Designer");
const PrinterOwner = require("../models/Printer_Owner");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const jwt= require("jsonwebtoken")
const sequelize = require("../sequelize");
// Setup multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
  { name: "profile_pic", maxCount: 1 },
  { name: "cnic_pic", maxCount: 1 },
]);

// Helper function to save files locally
const saveFileLocally = (buffer, filename) => {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

// Signup route
router.post("/signup", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ error: "File upload error: " + err.message });
    }

    const {
      name,
      username,
      email,
      password,
      location,
      phoneNo,
      cnic_number,
      sellerType,
      bio,
    } = req.body;

    const cnic_pic = req.files["cnic_pic"]
      ? req.files["cnic_pic"][0].buffer
      : null;
    const profile_pic = req.files["profile_pic"]
      ? req.files["profile_pic"][0].buffer
      : null;

    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create a new user
      const newUser = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        location,
        phoneNo,
        sellerType,
      });

      // Save the profile_pic and cnic_pic to the file system and get their paths
      const cnic_pic_path = cnic_pic
        ? saveFileLocally(cnic_pic, `cnic_${newUser.user_id}.jpg`)
        : null;
      const profile_pic_path = profile_pic
        ? saveFileLocally(profile_pic, `profile_${newUser.user_id}.jpg`)
        : null;

      // Update the newUser with the profile_pic path
      if (profile_pic_path) {
        await newUser.update({ profile_pic: profile_pic_path });
      }

      // Create a Designer or Printer Owner based on sellerType
      let seller;
      if (sellerType === "Designer") {
        seller = await Designer.create({
          user_id: newUser.user_id,
          cnic_number,
          cnic_pic: cnic_pic_path,
          bio,
        });
      } else if (sellerType === "Printer Owner") {
        seller = await PrinterOwner.create({
          user_id: newUser.user_id,
          cnic_number,
          cnic_pic: cnic_pic_path,
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
        tokenPayload = {
          user_id: user.user_id,
          email: user.email,
          sellerType: user.sellerType,
          seller_id: sellerId
        };
      } else if (user.sellerType === "Printer Owner") {
        const printerOwner = await PrinterOwner.findOne({
          where: { user_id: user.user_id },
        });
        sellerId = printerOwner ? printerOwner.printerOwner_id : null;
        tokenPayload = {
          user_id: user.user_id,
          email: user.email,
          sellerType: user.sellerType,
          seller_id: user.sellerId,
        };
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


///*********** */



/*

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
        tokenPayload.user_id = sellerId; // Include designer_id in token payload
      } else if (user.sellerType === "Printer Owner") {
        const printerOwner = await PrinterOwner.findOne({
          where: { user_id: user.user_id },
        });
        sellerId = printerOwner ? printerOwner.printerOwner_id : null;
        tokenPayload.user_id = sellerId; // Include printerOwner_id in token payload
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

/////////*
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
        tokenPayload.user_id = sellerId; // Include designer_id in token payload
      } else if (user.sellerType === "Printer Owner") {
        const printerOwner = await PrinterOwner.findOne({
          where: { user_id: user.user_id },
        });
        sellerId = printerOwner ? printerOwner.printerOwner_id : null;
        tokenPayload.user_id = sellerId; // Include printerOwner_id in token payload
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
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
  console.log(user.user_id)
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
        console.log("des")
        const designer = await Designer.findOne({
          where: { user_id: user.user_id },
        });
        sellerId = designer ? designer.designer_id : null;
        tokenPayload.designer_id = sellerId;
      } else if (user.sellerType === "Printer Owner") {
        console.log("pri")
        const printerOwner = await PrinterOwner.findOne({
          where: { user_id: user.user_id },
        });
        sellerId = printerOwner ? printerOwner.printerOwner_id : null;
        tokenPayload.printerOwner_id = sellerId;
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

*/
router.get("/designers/:designer_id", async (req, res) => {
  const { designer_id } = req.params;

  try {
    const [results] = await sequelize.query(
      `
      SELECT 
        "Users".name,
        "Users".location,
        "Users".profile_pic, -- Assume this is now the filename or relative path
        "Designers".bio,
        "Designers".ratings
      FROM 
        "Designers"
      JOIN 
        "Users" ON "Designers".user_id = "Users".user_id
      WHERE 
        "Designers".designer_id = :designer_id
    `,
      {
        replacements: { designer_id },
      }
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Designer not found" });
    }

    res.json(results[0]);
  } catch (err) {
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
