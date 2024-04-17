const { Schema, model } = require("mongoose");

const stateSchema = new Schema({
  owner: Schema.Types.ObjectId,
  figure: Schema.Types.ObjectId,
  name: {
    type: String,
    enum: ["Not seen yet", "Wishlist", "Training", "One side", "Mastered"],
  },
  // Subfield for "One side"
  oneSide: {
    type: String,
    enum: ["Right side", "Left side"],
  },
});

const State = model("State", stateSchema);

module.exports = State;
