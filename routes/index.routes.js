const router = require("express").Router();

//! all routes here are prefixed with /api

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/figures", require("./figures.routes.js"));

module.exports = router;
