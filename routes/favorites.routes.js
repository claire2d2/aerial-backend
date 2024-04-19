const router = require("express").Router();
const Favorite = require("./../models/Favorite.model");
const isAuthenticated = require("./../middlewares/isAuthenticated");

//! all routes here are prefixed with /api/favorites
router.use(isAuthenticated);

// get all the favorite figures of a person
router.get("/", async (req, res, next) => {
  try {
    const user = req.currentUserId;
    const allMyFaves = await Favorite.find({ user: user });
    res.status(200).json(allMyFaves);
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
