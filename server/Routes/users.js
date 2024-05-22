const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Designer = require("../models/Designer"); // Import the Designer model
const PrinterOwner = require("../models/Printer_Owner"); // Import the PrinterOwner model

router.post("/signup", async (req, res) => {
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
    bio 
  } = req.body;
console.log(
  name,
  username,
  email,
  password,
  location,
  profile_pic,
  phoneNo,
  cnic_number,
  cnic_pic,
  sellerType
);
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    // Create a new user
    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      location,
      profile_pic,
      phoneNo,
    });

    // Create either a Designer or PrinterOwner based on sellerType
    let seller;
    if (sellerType === "Designer") {
      seller = await Designer.create({
        user_id: newUser.user_id,
        cnic_number,
        cnic_pic,
        bio
       
      });
    } else if (sellerType === "Printer Owner") {
      seller = await PrinterOwner.create({
        user_id: newUser.user_id,
        cnic_number,
        cnic_pic,
        bio
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
    const users = await pool.query("SELECT * FROM USERS WHERE email = $1", [
      email,
    ]);
    if (!users.rows.length) {
      return res.status(401).json({ detail: "User does not exist!" });
    }

    const match = await bcrypt.compare(password, users.rows[0].password);

    if (match) {
      const user = users.rows[0];
      const tokenPayload = {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(
        tokenPayload,
        `${process.env.ACCESS_TOKEN_SECRET}`,
        {
          expiresIn: "1hr",
        }
      );

      // Check role and perform authorization logic here
      if (user.role === "user") {
        // Example: Allow access to user-specific data
        res.json({ email: user.email, token, access: "user-specific-data" });
      } else if (user.role === "employer") {
        // Example: Allow access to employer-specific data
        res.json({
          email: user.email,
          token,
          access: "employer-specific-data",
        });
      } else {
        // If the role doesn't match any expected roles, deny access
        res.status(403).json({ detail: "Forbidden" });
      }
    } else {
      res.status(401).json({ detail: "Login failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: "Internal Server Error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM USERS");
    res.json(users.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: err.detail || "Internal Server Error" });
  }
});

router.put("/update_profile/:userId", async (req, res) => {
  const { userId } = req.params;
  const { username, email, password, skills } = req.body;

  const salt = bcrypt.genSaltSync(10); // Define the salt variable
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const updatedUser = await pool.query(
      "UPDATE USERS SET username = $1, email = $2, password = $3, skills = $4 WHERE user_id = $5 RETURNING *",
      [username, email, hashedPassword, skills, userId]
    );

    res.status(200).json({
      message: "User profile updated successfully",
      data: updatedUser.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await pool.query("SELECT * FROM USERS WHERE email = $1", [
      email,
    ]);
    if (!users.rows.length) {
      return res.status(401).json({ detail: "User does not exist!" });
    }

    const match = await bcrypt.compare(password, users.rows[0].password);

    if (match) {
      const user = users.rows[0];
      const tokenPayload = {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(
        tokenPayload,
        `${process.env.ACCESS_TOKEN_SECRET}`,
        {
          expiresIn: "1hr",
        }
      );

      // Check role and perform authorization logic here
      if (user.role === "user") {
        // Example: Allow access to user-specific data
        res.json({ email: user.email, token, access: "user-specific-data" });
      } else if (user.role === "employer") {
        // Example: Allow access to employer-specific data
        res.json({
          email: user.email,
          token,
          access: "employer-specific-data",
        });
      } else {
        // If the role doesn't match any expected roles, deny access
        res.status(403).json({ detail: "Forbidden" });
      }
    } else {
      res.status(401).json({ detail: "Login failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: "Internal Server Error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM USERS");
    res.json(users.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: err.detail || "Internal Server Error" });
  }
});

module.exports = router;

// Configure multer for file uploads
/*
const upload = multer({ dest: "uploads/" });

router.post("/signup", upload.single("cnic_pic"), async (req, res) => {
  const { name, username, email, password, location, profile_pic, phoneNo } =
    req.body;
    console.log(
      name,
      username,
      email,
      password,
      location,
      profile_pic,
      phoneNo
    );
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const cnicPicPath = req.file.path;

    // Preprocess and perform OCR on the CNIC picture
    const cnicText = await processCNICPicture(cnicPicPath);
    fs.unlinkSync(cnicPicPath); // Delete the uploaded file after processing

    // Extract CNIC number using a regex
    const cnicPattern = /\b\d{5}-\d{7}-\d{1}\b/;
    const cnicMatch = cnicText.match(cnicPattern);
    if (!cnicMatch) {
      return res
        .status(400)
        .json({ error: "CNIC Number not found in the OCR result" });
    }

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      location,
      profile_pic,
      phoneNo,
     
    });
    res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const processCNICPicture = async (filePath) => {
  const image = await Jimp.read(filePath);
  // Optionally, preprocess the image (e.g., convert to grayscale, resize, etc.)
  const preprocessedImageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

  const result = await Tesseract.recognize(preprocessedImageBuffer, "eng+urd", {
    logger: (m) => console.log(m),
  });

  let text = result.data.text;
  // Remove non-English characters (including Urdu)
  text = text.replace(/[^\x00-\x7F]/g, "");
  console.log("OCR Result (English only):", text);

  return text;
};
*/

/*
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await pool.query("SELECT * FROM USERS WHERE email = $1", [
      email,
    ]);
    if (!users.rows.length) {
      // Corrected check for existing user
      return res.status(401).json({ detail: "User does not exist!" });
    }

    const match = await bcrypt.compare(
      password,
      users.rows[0].password 
    );

    if (match) {
      const token = jwt.sign({ email }, `${process.env.ACCESS_TOKEN_SECRET}`, {
        expiresIn: "1hr",
      });
      res.json({ email: users.rows[0].email, token });
    } else {
      res.status(401).json({ detail: "Login failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: "Internal Server Error" });
  }
});
*/
