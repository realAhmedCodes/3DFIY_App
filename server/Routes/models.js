const express = require("express");
const router = express.Router();
const multer = require("multer");
const Model = require("../models/Model");
const path = require("path");
const fs = require("fs");

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /obj|stl|jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    // Known MIME types for .stl files
    const knownStlMimeTypes = [
      "application/sla",
      "model/stl",
      "application/vnd.ms-pki.stl",
      "application/octet-stream",
    ];

    const mimetypes = [
      ...knownStlMimeTypes,
      "text/plain", // .obj files
      "image/jpeg",
      "image/png",
    ];

    const mimetype = mimetypes.includes(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(
        new Error("Only .obj, .stl, .jpeg, .jpg, and .png files are allowed!")
      );
    }
  },
});

// Define the uploads directory
const uploadsDir = path.join(__dirname, "..", "uploads", "models");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

router.post(
  "/uploadModel",
  upload.fields([
    { name: "modelFile", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { category_id, designer_id, name, description, price, is_free } =
        req.body;

      // Save model file and image locally
      const modelFilePath = saveFileLocally(
        req.files["modelFile"][0].buffer,
        `${name}_model_${Date.now()}.${path.extname(
          req.files["modelFile"][0].originalname
        )}`
      );
      const imagePath = saveFileLocally(
        req.files["image"][0].buffer,
        `${name}_image_${Date.now()}.${path.extname(
          req.files["image"][0].originalname
        )}`
      );

      const newModel = await Model.create({
        category_id,
        designer_id,
        name,
        description,
        price,
        is_free,
        model_file: modelFilePath,
        image: imagePath,
        likes_count: 0,
        download_count: 0,
      });

      res.status(201).json(newModel);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to upload model" });
    }
  }
);

const saveFileLocally = (buffer, filename) => {
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

router.get("/models", async (req, res) => {
  try {
    // Query all models from the database
    const allModels = await Model.findAll();

    // Check if any models were found
    if (allModels.length === 0) {
      return res.status(404).json({ message: "No models found" });
    }

    // If models were found, return them in the response
    res.status(200).json(allModels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

module.exports = router;
