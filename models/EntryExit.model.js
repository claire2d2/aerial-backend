const { Schema, model } = require("mongoose");

const entryExitSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    figureFrom: {
      type: Schema.Types.ObjectId,
      ref: "Figure",
    },
    figureTo: {
      type: Schema.Types.ObjectId,
      ref: "Figure",
    },
  },
  { timestamps: true }
);

const EntryExit = model("EntryExit", entryExitSchema);

module.exports = EntryExit;
