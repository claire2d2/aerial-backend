const router = require("express").Router();
const State = require("./../models/State.model");
const isAuthenticated = require("./../middlewares/isAuthenticated");

//! all routes here are prefixed with /api/states

router.use(isAuthenticated);

// find all states included and populate with the figures in the state articles
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.currentUserId;
    const { activeFilters } = req.body;
    const filteredStates = await State.find({
      name: { $in: activeFilters },
      owner: user,
    });
    res.status(200).json(filteredStates);
  } catch (error) {
    next(error);
  }
});

// find the id for the state to edit when trying to modify it
router.get("/fig/:figureId", async (req, res, next) => {
  try {
    const ownerId = req.currentUserId;
    const figureId = req.params.figureId;
    const foundState = await State.findOne({
      figure: figureId,
      owner: ownerId,
    });
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
