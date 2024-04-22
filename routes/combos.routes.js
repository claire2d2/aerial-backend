const router = require("express").Router();
const Combo = require("./../models/Combo.model");
var ObjectId = require("mongoose").Types.ObjectId;
const isAuthenticated = require("./../middlewares/isAuthenticated");

//! all routes here are prefixed with /api/combos

router.use(isAuthenticated);
// fetch all combos based on the current discipline and user
// save your combo
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const owner = req.currentUserId;
    let discipline;
    if (req.query.discipline) {
      let disciplineId;
      switch (req.query.discipline) {
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
      discipline = new ObjectId(disciplineId);
    }
    const foundCombos = await Combo.find({
      owner: owner,
      discipline: discipline,
    });
    res.status(200).json(foundCombos);
  } catch (error) {
    next(error);
  }
});

// save a combo / create a combo
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
