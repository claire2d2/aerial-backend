const router = require("express").Router();
const State = require("./../models/State.model");

//! all routes here are prefixed with /api/states

// find the id for the state to edit when trying to modify it
router.get("/:figureId", async (req, res, next) => {
  try {
    const owner = req.currentUserId;
    const figure = req.params.figureId;
    const foundState = await State.findOne({ figure: figure, owner: owner });
    res.status(200).json(foundState);
  } catch (error) {
    next(error);
  }
});

// edit the state (that has been initialized during user creation)
router.put("/:stateId", async (req, res, next) => {
  try {
    const id = req.params.stateId;
    const { name, oneSide } = req.body;
    const stateToEdit = { name, oneSide };
    const updatedState = await State.findOneAndUpdate(
      { _id: id },
      stateToEdit,
      { new: true }
    );
    res.status(200).json(updatedState);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
