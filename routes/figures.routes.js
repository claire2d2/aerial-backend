const router = require("express").Router();
const Figure = require("./../models/Figure.model");
var ObjectId = require("mongoose").Types.ObjectId;

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
router.get("/by/:ref", async (req, res, next) => {
  try {
    let disciplineId;
    const { ref } = req.params;
    switch (ref) {
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
    // const foundDiscipline = await Discipline.findById(disciplineId);
    // console.log(foundDiscipline);
    const objectId = new ObjectId(disciplineId);
    const allFigures = await Figure.find({
      discipline: objectId,
    }).sort({
      name: 1,
    });
    console.log(disciplineId);
    res.status(200).json(allFigures);
  } catch (error) {
    next(error);
  }
});

// get all the figures based on search

router.get("/search/:figName", async (req, res, next) => {
  try {
    const search = req.params.figName;
    const searchFigures = await Figure.find({
      name: { $regex: new RegExp(search, "i") },
    }).populate(["discipline", "focus"]);
    res.status(200).json(searchFigures);
  } catch (error) {
    next(error);
  }
});

// get a specific figure and the related progress logs
// TODO get the related entries/exits?
// TODO if possibility to add a figure, add all the states for existing users
router.get("/fig/:figureRef", async (req, res, next) => {
  try {
    const { figureRef } = req.params;
    const oneFigure = await Figure.findOne({ ref: figureRef }).populate([
      "discipline",
      "focus",
    ]);
    // const progressLogs = await ProgressLog.find({ figure: oneFigure.id })
    //   .sort({ date: -1 })
    //   .populate("status");
    res.status(200).json(oneFigure);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
