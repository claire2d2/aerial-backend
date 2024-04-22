const { Schema, model } = require("mongoose");

const comboSchema = new Schema({
  name: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  discipline: {
    type: Schema.Types.ObjectId,
    ref: "Discipline",
  },

  figures: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Figure",
      },
    ],
    max: 8,
    min: 1,
  },
  comment: {
    type: String,
    maxLength: 500,
  },
});

const Combo = model("Combo", comboSchema);

module.exports = Combo;
