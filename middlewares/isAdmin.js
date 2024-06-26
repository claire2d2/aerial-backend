const User = require("../models/User.model.js");

async function isAdmin(req, res, next) {
  try {
    const currentUser = await User.findById(req.currentUserId);
    if (currentUser.roles.includes("admin")) {
      return next;
    }
  } catch (error) {
    res.status(403).json({ message: "Unauthorized" });
  }
}

module.exports = isAdmin;
