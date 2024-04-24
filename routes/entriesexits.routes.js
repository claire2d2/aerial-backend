const router = require("express").Router();
const EntryExit = require("./../models/EntryExit.model");
const EntryExitLike = require("./../models/EntryExitLike.model");
const isAuthenticated = require("./../middlewares/isAuthenticated");

//! all routes here are prefixed with /api/entriesexits
router.use(isAuthenticated);

// propose an entry
router.post("/entry/:figureId", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.currentUserId;
    const figure = req.params.figureId;
    const { entry } = req.body;
    const foundEntry = await EntryExit.findOne({
      figureFrom: entry,
      figureTo: figure,
    });
    if (foundEntry) {
      return res
        .status(400)
        .json({ message: "This figure has already been proposed!" });
    }
    if (entry === figure) {
      return res.status(400).json({
        message: "You can't propose the same figure as the current one!",
      });
    }
    const propToCreate = { owner: user, figureTo: figure, figureFrom: entry };
    const createdProp = await EntryExit.create(propToCreate);
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
    const foundExit = await EntryExit.findOne({
      figureFrom: figure,
      figureTo: exit,
    });
    if (foundExit) {
      return res
        .status(400)
        .json({ message: "This figure has already been proposed!" });
    }
    if (exit === figure) {
      return res.status(400).json({
        message: "You can't propose the same figure as the current one!",
      });
    }
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
    ); // Fetch the counts of likes for each entry
    const entriesWithLikes = await Promise.all(
      allEntries.map(async (entry) => {
        const likeCount = await EntryExitLike.countDocuments({
          entryExit: entry._id,
        });
        return { entry, likeCount };
      })
    );

    // Sort the entries based on the number of likes
    entriesWithLikes.sort((a, b) => b.likeCount - a.likeCount);

    // Extract only the entries from the sorted array
    const sortedEntries = entriesWithLikes.map((item) => item.entry);

    res.status(200).json(sortedEntries);
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
    ); // Fetch the counts of likes for each exit
    const exitsWithLikes = await Promise.all(
      allExits.map(async (exit) => {
        const likeCount = await EntryExitLike.countDocuments({
          entryExit: exit._id,
        });
        return { exit, likeCount };
      })
    );

    // Sort the exits based on the number of likes
    exitsWithLikes.sort((a, b) => b.likeCount - a.likeCount);

    // Extract only the exits from the sorted array
    const sortedExits = exitsWithLikes.map((item) => item.exit);

    res.status(200).json(sortedExits);
  } catch (error) {
    next(error);
  }
});

// get user to like an entry exit proposition

router.post("/like/:propId", async (req, res, next) => {
  try {
    const proposition = req.params.propId;
    const follower = req.currentUserId;
    const alreadyLiked = await EntryExitLike.findOne({
      entryExit: proposition,
      follower: follower,
    });
    if (alreadyLiked) {
      return res.status(400).json({ message: "Already liked!" });
    }
    const createdLike = await EntryExitLike.create({
      entryExit: proposition,
      follower: follower,
    });
    res.status(201).json(createdLike);
  } catch (error) {
    next(error);
  }
});

// if click, unlike the entry

router.delete("/like/:propId", async (req, res, next) => {
  try {
    const proposition = req.params.propId;
    const follower = req.currentUserId;
    await EntryExitLike.findOneAndDelete({
      entryExit: proposition,
      follower: follower,
    });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// retrieve all the likes for a given entry

router.get("/likes/:propId", async (req, res, next) => {
  try {
    const proposition = req.params.propId;
    const allLikes = await EntryExitLike.find({ entryExit: proposition });
    res.status(200).json(allLikes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
