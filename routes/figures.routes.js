const router = require("express").Router();
const Figure = require("./../models/Figure.model");

//! all routes here are prefixed with /api/figures

// get all the figures depending on the discipline
router.get("/:discipline", async (req, res, next) => {
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

module.exports = router;
