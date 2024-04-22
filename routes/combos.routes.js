const router = require("express").Router();
const Combo = require("./../models/Combo.model");
const isAuthenticated = require("./../middlewares/isAuthenticated");

//! all routes here are prefixed with /api/combos

// save your combo
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const owner = req.currentUserId;
    const { name, discipline, figures } = req.body;
    const comboToCreate = {
      owner: owner,
      name: name,
      discipline: discipline,
      figures: figures,
    };
    const createdCombo = await Combo.create(comboToCreate);
    res.status(201).json(createdCombo);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
