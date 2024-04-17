const router = require("express").Router();
const State = require("./../models/State.model");

//! all routes here are prefixed with /api/states

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
