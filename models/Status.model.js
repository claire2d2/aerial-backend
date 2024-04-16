const { Schema, model } = require("mongoose");

const statusSchema = new Schema({
  user: Schema.Types.ObjectId,
  figure: Schema.Types.ObjectId,
  name: {
    type: String,
    enum: [
      "Not seen yet",
      "Wishlist",
      "Training",
      "Right side",
      "Left side",
      "Mastered",
    ],
  },
});

const Status = model("Status", statusSchema);

module.exports = Status;
