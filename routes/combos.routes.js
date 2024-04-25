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
    const { discipline } = req.query;
    disciplineId = new ObjectId(discipline);
    const foundCombos = await Combo.find({
      owner: owner,
      discipline: disciplineId,
    }).populate("figures");
    res.status(200).json(foundCombos);
  } catch (error) {
    next(error);
  }
});

// save a combo / create a combo
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const owner = req.currentUserId;
    const { name, discipline, figures, comment } = req.body;
    const comboToCreate = {
      owner: owner,
      name: name,
      discipline: discipline,
      figures: figures,
      comment: comment,
    };
    const createdCombo = await Combo.create(comboToCreate);
    res.status(201).json(createdCombo);
  } catch (error) {
    next(error);
  }
});

// edit a combo
router.put("/:comboId", isAuthenticated, async (req, res, next) => {
  try {
    const id = req.params.comboId;
    const { name, discipline, figures, comment } = req.body;
    const comboToEdit = { name, discipline, figures, comment };
    const updatedCombo = await Combo.findOneAndUpdate(
      { _id: id },
      comboToEdit,
      { new: true }
    );
    res.status(200).json(updatedCombo);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
