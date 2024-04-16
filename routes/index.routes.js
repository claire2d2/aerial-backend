const router = require("express").Router();

//! all routes here are prefixed with /api

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/figures", require("./figures.routes.js"));
router.use("/auth", require("./auth.routes.js"));

module.exports = router;
