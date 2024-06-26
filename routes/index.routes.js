const router = require("express").Router();

//! all routes here are prefixed with /api

router.get("/health", (req, res, next) => {
  res.json("All good in here");
});

router.use("/figures", require("./figures.routes.js"));
router.use("/auth", require("./auth.routes.js"));
router.use("/favorites", require("./favorites.routes.js"));
router.use("/disciplines", require("./disciplines.routes.js"));
router.use("/zones", require("./zones.routes.js"));
router.use("/logs", require("./logs.routes.js"));
router.use("/states", require("./states.routes.js"));
router.use("/entriesexits", require("./entriesexits.routes.js"));
router.use("/combos", require("./combos.routes.js"));

module.exports = router;
