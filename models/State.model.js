const { Schema, model } = require("mongoose");

const stateSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  figure: {
    type: Schema.Types.ObjectId,
    ref: "Figure",
  },
  name: {
    type: String,
    enum: ["Not seen yet", "Wishlist", "Training", "One side", "Mastered"],
  },
  // Subfield for "One side"
  oneSide: {
    type: String,
    enum: ["Right side", "Left side"],
  },
  range: {
    type: Number,
    min: 0,
    max: 40,
  },
});

const State = model("State", stateSchema);

module.exports = State;
