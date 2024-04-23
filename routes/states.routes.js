const router = require("express").Router();
const State = require("./../models/State.model");
const isAuthenticated = require("./../middlewares/isAuthenticated");

//! all routes here are prefixed with /api/states

router.use(isAuthenticated);

// find all states included and populate with the figures in the state articles
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.currentUserId;
    const searchFor = { owner: user };
    const allStates = ["Mastered", "Training", "Wishlist", "Not seen yet"];
    if (req.query.filtersQuery) {
      searchFor.$or = [];
      const activeFilters = req.query.filtersQuery.split(",");
      if (activeFilters.length > 0) {
        for (let i = 0; i < activeFilters.length; i++) {
          if (allStates.includes(activeFilters[i])) {
            searchFor.$or.push({ name: activeFilters[i], oneSide: null });
          } else {
            searchFor.$or.push({ oneSide: activeFilters[i] });
          }
        }
      }
    }
    const filteredStates = await State.find(searchFor).populate("figure");
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
    const { name, oneSide, range } = req.body;
    const stateToEdit = { name, oneSide, range };
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
