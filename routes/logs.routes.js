const router = require("express").Router();
const ProgressLog = require("../models/ProgressLog.model");
const isAuthenticated = require("./../middlewares/isAuthenticated.js");
const fileUploader = require("./../config/cloudinary.config.js");

//! all routes here are prefixed with /api/logs

router.use(isAuthenticated);

// route to find all routes with a specific figure Id and the user

router.get("/:figureId", async (req, res, next) => {
  try {
    const figure = req.params.figureId;
    const user = req.currentUserId;
    const allLogs = await ProgressLog.find({ figure: figure, owner: user });
    res.status(200).json(allLogs);
  } catch (error) {
    next(error);
  }
});

// route to let a user post a log to a specific figure
router.post(
  "/:figureId",
  fileUploader.single("image"),
  async (req, res, next) => {
    try {
      const { status, content, date } = req.body;
      const figure = req.params.figureId;
      const owner = req.currentUserId;
      let imageUrl = "";
      if (req.file) {
        imageUrl = req.file.path;
      }
      const logToCreate = {
        figure,
        owner,
        status,
        image: imageUrl,
        content,
        date,
      };
      const createdLog = await ProgressLog.create(logToCreate);
      res.status(201).json(createdLog);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// let user delete his or her own log
router.delete("/:logId", async (req, res, next) => {
  try {
    await ProgressLog.findOneAndDelete({
      _id: req.params.logId,
      owner: req.currentUserId,
    });
    res.sendStatus(204);
  } catch (error) {}
});
// {
//     figure: { type: Schema.Types.ObjectId, ref: "Figure" },
//     owner: { type: Schema.Types.ObjectId, ref: "User" },
//     status: { type: Schema.Types.ObjectId, ref: "Status" },
//     image: String,
//     content: String,
//     date: Date,
//   },
//   { timestamps: true }

module.exports = router;
