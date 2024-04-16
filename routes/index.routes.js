const router = require("express").Router();

//! all routes here are prefixed with /api

router.get("/health", (req, res, next) => {
  res.json("All good in here");
});

router.use("/figures", require("./figures.routes.js"));
router.use("/auth", require("./auth.routes.js"));
router.use("/favorites", require("./favorites.routes.js"));

module.exports = router;
