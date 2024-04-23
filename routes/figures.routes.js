const router = require("express").Router();
const Figure = require("./../models/Figure.model");
const State = require("./../models/State.model");
const User = require("./../models/User.model");
var ObjectId = require("mongoose").Types.ObjectId;
const isAuthenticated = require("./../middlewares/isAuthenticated");
const isAdmin = require("./../middlewares/isAdmin");

//! all routes here are prefixed with /api/figures

// // get all the figures regardless of their discipline
// router.get("/", async (req, res, next) => {
//   try {
//     const allFigures = await Figure.find();
//     res.status(200).json(allFigures);
//   } catch (error) {
//     next(error);
//   }
// });

// get all the figures depending on the discipline
router.get(`/`, async (req, res, next) => {
  try {
    // const foundDiscipline = await Discipline.findById(disciplineId);
    // console.log(foundDiscipline);
    console.log(req.query);
    const queryFilters = generateFilters(req.query);
    console.log(queryFilters);
    const allFigures = await Figure.find(queryFilters).populate("focus").sort({
      name: 1,
    });
    res.status(200).json(allFigures);
  } catch (error) {
    next(error);
  }
});

// get figures based on filters
//! not optimal, to improve and avoid hardcoding the zones and discipline Ids

function generateFilters(query) {
  const search = {};
  if (query.discipline) {
    search.discipline = new ObjectId(query.discipline);
  }
  if (query.levels && query.levels.length !== 0) {
    const levels = query.levels.split(",");
    search.difficulty = { $in: levels };
  }
  // TODO : find a way to link zone names and zone ids, then replace zoneName in ObjectId with that
  if (query.zones && query.zones.length !== 0) {
    const zoneNames = query.zones.split(",");
    const zoneIds = [];
    for (zone of zoneNames) {
      switch (zone) {
        case "legs":
          zoneIds.push("6623ecbef01d3907e8242123");
          break;
        case "shoulders":
          zoneIds.push("6623ecbef01d3907e8242124");
          break;
        case "core":
          zoneIds.push("6623ecbef01d3907e8242125");
          break;
        case "arms":
          zoneIds.push("6623ecbef01d3907e8242126");
          break;
        case "back":
          zoneIds.push("6623ecbef01d3907e8242127");
          break;
        case "hips":
          zoneIds.push("6623ecbef01d3907e8242128");
          break;
        case "knees":
          zoneIds.push("6623ef3af01d3907e824212c");
          break;
        case "elbows":
          zoneIds.push("6623ef3af01d3907e824212d");
          break;
        case "armpits":
          zoneIds.push("6623ef3af01d3907e824212e");
          break;
        default:
          break;
      }
    }
    const zoneObjectIds = zoneIds.map((zoneId) => new ObjectId(zoneId));
    search.focus = { $elemMatch: { $in: zoneObjectIds } };
  }

  return search;
}

// get all the figures based on search
router.get("/search/:figName", async (req, res, next) => {
  try {
    const search = req.params.figName;
    const searchFigures = await Figure.find({
      name: { $regex: new RegExp(search, "i") },
    }).populate(["discipline", "focus"]);
    res.status(200).json(searchFigures);
  } catch (error) {
    next(error);
  }
});

// get a specific figure and the related progress logs
// ? get the related entries/exits
router.get("/fig/:figureRef", async (req, res, next) => {
  try {
    const { figureRef } = req.params;
    const oneFigure = await Figure.findOne({ ref: figureRef }).populate([
      "discipline",
      "focus",
    ]);
    // const progressLogs = await ProgressLog.find({ figure: oneFigure.id })
    //   .sort({ date: -1 })
    //   .populate("status");
    res.status(200).json(oneFigure);
  } catch (error) {
    next(error);
  }
});

// add a figure when user is authenticated (mod or admin is filtered through front end)
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const {
      name,
      ref,
      discipline,
      difficulty,
      image,
      imgArtist,
      imgArtistUrl,
      focus,
    } = req.body;
    const foundFigName = await Figure.findOne({ name });
    if (foundFigName) {
      return res.status(400).json({
        message:
          "This figure already exists! Please check if another discipline has a figure with the same name.",
      });
    }
    const figToCreate = {
      name: name.toLowerCase(),
      ref: ref.toLowerCase(),
      discipline: discipline.toLowerCase(),
      difficulty,
      image: image.toLowerCase(),
      imgArtist: imgArtist.toLowerCase(),
      imgArtistUrl: imgArtistUrl.toLowerCase(),
      focus,
    };

    const createdFig = await Figure.create(figToCreate);
    // create a "not seen yet" state for all existing users
    const allUsers = await User.find();

    const addStateToUsers = allUsers.map(async (user) => {
      await State.create({
        figure: createdFig._id,
        owner: user._id,
        name: "Not seen yet",
        range: 0,
      });
    });
    await Promise.all(addStateToUsers);
    res.status(201).json(createdFig);
  } catch (error) {
    next(error);
  }
});

// edit an existing figure when user is authenticated (mod or admin is filtered through front end)
router.put("/:figureId", async (req, res, next) => {
  try {
    const id = req.params.figureId;
    const { name, ref, difficulty, image, imgArtist, imgArtistUrl, focus } =
      req.body;
    const figureToEdit = {
      name,
      ref,
      difficulty,
      image,
      imgArtist,
      imgArtistUrl,
      focus,
    };
    const updatedFigure = await Figure.findOneAndUpdate(
      { _id: id },
      figureToEdit,
      { new: true }
    );
    res.status(200).json(updatedFigure);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
