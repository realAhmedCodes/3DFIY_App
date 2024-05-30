const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Model = require("../models/Model");
const Like = require("../models/Likes")
const sequelize = require("../sequelize");



router.post("/like/:modelId/:user_id", async (req, res) => {
  const { modelId, user_id } = req.params;

  try {
    const [like, created] = await Like.findOrCreate({
      where: { model_id: modelId, user_id },
      defaults: { liked: true },
    });

    if (!created && !like.liked) {
      like.liked = true;
      await like.save();
      await Model.increment("likes_count", {
        by: 1,
        where: { model_id: modelId },
      });
    } else if (created) {
      await Model.increment("likes_count", {
        by: 1,
        where: { model_id: modelId },
      });
    }

    res.json({ message: "Model liked successfully", like });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to unlike a model
router.post("/unlike/:modelId/:user_id", async (req, res) => {
  const { modelId, user_id } = req.params;

  try {
    const like = await Like.findOne({ where: { model_id: modelId, user_id } });

    if (!like) {
      return res.status(404).json({ error: "Like not found" });
    }

    if (like.liked) {
      like.liked = false;
      await like.save();
      await Model.decrement("likes_count", {
        by: 1,
        where: { model_id: modelId },
      });
    }

    res.json({ message: "Model unliked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




router.get("/likeCheck/:modelId/:userId", async (req, res) => {
  const { modelId, userId } = req.params;
console.log("like check", modelId, userId)
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
});


module.exports = router;
