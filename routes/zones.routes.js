const router = require("express").Router();
const Zone = require("../models/Zone.model");

//! all routes here are prefixed with /api/disciplines

router.get("/", async (req, res, next) => {
  try {
    const allZones = await Zone.find();
    res.status(200).json(allZones);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
