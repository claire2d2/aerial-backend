const { Schema, model } = require("mongoose");

const entryExitSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    figureFrom: {
      type: Schema.Types.ObjectId,
      ref: "Figure",
      required: true,
    },
    figureTo: {
      type: Schema.Types.ObjectId,
      ref: "Figure",
      required: true,
    },
  },
  { timestamps: true }
);

const EntryExit = model("EntryExit", entryExitSchema);

module.exports = EntryExit;
