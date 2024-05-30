const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Model = require("../models/Model");
const SavedModel = require("../models/SavedModel");
const sequelize = require("../sequelize");

router.post("/save/:modelId/:user_id", async (req, res) => {
  const { modelId, user_id } = req.params;

  try {
    const [save, created] = await SavedModel.findOrCreate({
      where: { model_id: modelId, user_id },
      defaults: { saved: true },
    });

    if (!created && !save.saved) {
      save.saved = true;
      await save.save();
     
    }

    res.json({ message: "Model liked successfully", save });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to unlike a model
router.post("/unsave/:modelId/:user_id", async (req, res) => {
  const { modelId, user_id } = req.params;

  try {
    const save = await SavedModel.findOne({ where: { model_id: modelId, user_id } });

    if (!save) {
      return res.status(404).json({ error: "Save data not found" });
    }

    if (save.saved) {
      save.saved = false;
      await save.save();
     
    }

    res.json({ message: "Model unsaved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/*
router.get("/likeCheck/:modelId/:userId", async (req, res) => {
  const { modelId, userId } = req.params;
  console.log("like check", modelId, userId);
  try {
    const [results] = await sequelize.query(
      `
      SELECT 
        "Likes".model_id,
        "Likes".user_id,
        "Likes".liked,
        "Likes".like_id
      FROM 
        "Likes"
      WHERE 
        "Likes".model_id = :modelId
        AND "Likes".user_id = :userId
      `,
      {
        replacements: { modelId, userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});*/

module.exports = router;
