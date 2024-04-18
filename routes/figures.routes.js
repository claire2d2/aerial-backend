const router = require("express").Router();
const Figure = require("./../models/Figure.model");
const ProgressLog = require("./../models/ProgressLog.model");

//! all routes here are prefixed with /api/figures

// get all the figures regardless of their discipline
router.get("/", async (req, res, next) => {
  try {
    const allFigures = await Figure.find();
    res.status(200).json(allFigures);
  } catch (error) {
    next(error);
  }
});

// get all the figures depending on the discipline
router.get("/by/:discipline", async (req, res, next) => {
  try {
    let disciplineId;
    const { discipline } = req.params;
    switch (discipline) {
      case "pole":
        disciplineId = "661e485f64c347c27353960d";
        break;
      case "contorsion":
        disciplineId = "661e485f64c347c27353960f";
        break;
      case "aerial-hoop":
        disciplineId = "661e485f64c347c27353960e";
        break;
      default:
        break;
    }
    const allFigures = await Figure.find({ discipline: disciplineId });
    res.status(200).json(allFigures);
  } catch (error) {
    next(error);
  }
});

// get a specific figure and the related progress logs
// TODO get the related entries/exits?
// TODO if possibility to add a figure, add all the states for existing users
router.get("/:figureRef", async (req, res, next) => {
  try {
    const { figureRef } = req.params;
    const oneFigure = await Figure.findOne({ ref: figureRef }).populate(
      "discipline"
    );
    const progressLogs = await ProgressLog.find({ figure: oneFigure.id })
      .sort({ date: -1 })
      .populate("status");
    res.status(200).json({ oneFigure, progressLogs });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
