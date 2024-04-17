const router = require("express").Router();
const Discipline = require("../models/Discipline.model");

//! all routes here are prefixed with /api/disciplines

router.get("/", async (req, res, next) => {
  try {
    const allDisciplines = await Discipline.find();
    res.status(200).json(allDisciplines);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
