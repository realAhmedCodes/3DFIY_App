const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Designer = require("../models/Designer");
const  Category  = require("../models/Category");

router.get("/category", async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { parent_category_id: null }, // Fetch only parent categories
      order: [["createdAt", "DESC"]],
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/subcategories/:selectedCategory", async (req, res) => {
  const { selectedCategory } = req.params;
  try {
    const categories = await Category.findAll({
      where: { parent_category_id: selectedCategory }, // Fetch only parent categories
      order: [["createdAt", "DESC"]],
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
