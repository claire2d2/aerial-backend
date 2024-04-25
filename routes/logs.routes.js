const router = require("express").Router();
const ProgressLog = require("../models/ProgressLog.model");
const isAuthenticated = require("./../middlewares/isAuthenticated.js");
const cloudinary = require("cloudinary").v2;
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
      let imgPublicId = "";
      // Adjust the image quality (optional)
      const uploadOptions = {
        quality: 60, // Adjust the quality as needed (0 to 100)
      };
      if (req.file) {
        // Upload the file to Cloudinary with the specified options
        const result = await cloudinary.uploader.upload(
          req.file.path,
          uploadOptions
        );
        imageUrl = result.secure_url;
        imgPublicId = result.public_id;
      }

      const logToCreate = {
        figure,
        owner,
        status,
        image: imageUrl,
        content,
        date,
        imgPublicId,
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
    // Find the log entry to delete
    const logToDelete = await ProgressLog.findOneAndDelete({
      _id: req.params.logId,
      owner: req.currentUserId,
    });

    // If the log entry doesn't exist or doesn't belong to the user, return a 404 error
    if (!logToDelete) {
      return res.status(404).json({ error: "Log entry not found" });
    }

    // Check if the log entry has an associated image
    if (logToDelete.image) {
      // Use Cloudinary's API to delete the image
      await cloudinary.uploader.destroy(logToDelete.imgPublicId);
    }
    res.sendStatus(204);
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
