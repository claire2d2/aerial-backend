const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./../models/User.model");
const State = require("./../models/State.model");
const isAuthenticated = require("./../middlewares/isAuthenticated");

const SALT = 10;

//! all routes here are prefixed with /api/auth

router.post("/signup", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // in front end, input figures state when user signs up, to initialize each figure to "not seen yet"
    const { figures } = req.body;
    // if user already exists, error
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: "This email is already used" });
    }
    const hashedPassword = await bcrypt.hash(password, SALT);
    const createdUser = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    // initialize figure states
    const initialStates = figures.map(async (figureId) => {
      await State.create({
        figure: figureId,
        owner: createdUser._id,
        name: "Not seen yet",
        range: 0,
      });
    });
    await Promise.all(initialStates);

    // message is user and states are correctly created
    res.status(201).json({ message: "User created", id: createdUser._id });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email }, { password: 1, email: 1 });
    if (!foundUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const correctPassword = await bcrypt.compare(password, foundUser.password);
    if (!correctPassword) {
      return res.status(400).json({ message: "Wrong password" });
    }
    const token = jwt.sign({ id: foundUser._id }, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1d",
    });
    res.status(200).json({ authToken: token });
  } catch (error) {
    console.log(error);
    next(SyntaxError);
  }
});

router.put("/changepassword", isAuthenticated, async (req, res, next) => {
  try {
    const { user } = req.currentUserId;
    const { currentPassword, newPassword } = req.body;
    const foundUser = await User.findOne({ user: user });
    const correctPassword = await bcrypt.compare(
      currentPassword,
      foundUser.password
    );
    if (!correctPassword) {
      return res.status(400).json({ message: "Wrong password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, SALT);
    const updatedPassword = await User.findOneAndUpdate(
      { user: user },
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).json(updatedPassword);
  } catch (error) {
    next(error);
  }
});

router.put("/preferences", isAuthenticated, async (req, res, next) => {
  try {
    const { user } = req.currentUserId;
    const { darkModePref, filterHistPref } = req.body;
    const updatedPreferences = await User.findOneAndUpdate(
      { user: user },
      { darkModePref: darkModePref, filterHistPref: filterHistPref },
      { new: true }
    );
    res.status(200).json(updatedPreferences);
  } catch (error) {
    next(error);
  }
});

router.get("/verify", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.currentUserId);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
