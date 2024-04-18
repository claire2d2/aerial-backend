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

// make a figure a favorite
router.post("/:figureId", async (req, res, next) => {
  try {
    const figure = req.params.figureId;
    const user = req.currentUserId;
    const alreadyFave = await Favorite.findOne({ figure: figure, user: user });
    if (alreadyFave) {
      return res.status(400).json({ message: "Fave already exists" });
    }
    const createdFave = await Favorite.create({ figure: figure, user: user });
    res.status(201).json(createdFave);
  } catch (error) {
    next(error);
  }
});

// remove figure from favorites
router.delete("/:figureId", async (req, res, next) => {
  try {
    const figure = req.params.figureId;
    const user = req.currentUserId;
    await Favorite.findOneAndDelete({ figure: figure, user: user });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
