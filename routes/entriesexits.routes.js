const router = require("express").Router();
const EntryExit = require("./../models/EntryExit.model");
const isAuthenticated = require("./../middlewares/isAuthenticated");

//! all routes here are prefixed with /api/entriesexits
router.use(isAuthenticated);

// propose an entry
router.post("/entry/:figureId", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.currentUserId;
    const figure = req.params.figureId;
    const { entry } = req.body;
    const propToCreate = { owner: user, figureTo: figure, figureFrom: entry };
    const createdProp = await EntryExit.create(propToCreate);
    await EntryExit.create();
    res.status(201).json(createdProp);
  } catch (error) {
    next(error);
  }
});

// propose an exit
router.post("/exit/:figureId", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.currentUserId;
    const figure = req.params.figureId;
    const { exit } = req.body;
    const propToCreate = { owner: user, figureTo: exit, figureFrom: figure };
    const createdProp = await EntryExit.create(propToCreate);
    await EntryExit.create();
    res.status(201).json(createdProp);
  } catch (error) {
    next(error);
  }
});

// get all the entries for a figure

router.get("/entries/:figureId", async (req, res, next) => {
  try {
    const figure = req.params.figureId;
    const allEntries = await EntryExit.find({ figureTo: figure }).populate(
      "figureFrom"
    );
    res.status(200).json(allEntries);
  } catch (error) {
    next(error);
  }
});

// get all the exits for a figure

router.get("/exits/:figureId", async (req, res, next) => {
  try {
    const figure = req.params.figureId;
    const allExits = await EntryExit.find({ figureFrom: figure }).populate(
      "figureTo"
    );
    res.status(200).json(allExits);
  } catch (error) {
    next(error);
  }
});

module.exports = router;