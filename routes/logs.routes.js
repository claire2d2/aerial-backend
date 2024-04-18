const router = require("express").Router();
const ProgressLog = require("../models/ProgressLog.model");

//! all routes here are prefixed with /api/logs

// route to let a user post a log to a specific figure
router.post("/:figureId", async (req, res, next) => {
  try {
    const { status, image, content, date } = req.body;
    const owner = req.currentUserId;
    const figure = req.params.figureId;
    const logToCreate = { figure, owner, status, image, content, date };
    const createdLog = await ProgressLog.create(logToCreate);
    res.status(200).json(createdLog);
  } catch (error) {
    next(error);
  }
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
