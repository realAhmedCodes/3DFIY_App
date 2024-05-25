const express = require("express");
const router = express.Router();
const multer = require("multer");
const Model = require("../models/Model");
const path = require("path");

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

    console.log(`Received file: ${file.originalname}`);
    console.log(
      `File extension: ${path.extname(file.originalname).toLowerCase()}`
    );
    console.log(`MIME type: ${file.mimetype}`);

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

      const newModel = await Model.create({
        category_id,
        designer_id,
        name,
        description,
        price,
        is_free,
        model_file: req.files["modelFile"][0].buffer,
        image: req.files["image"][0].buffer,
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
