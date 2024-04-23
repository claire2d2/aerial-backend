const { Schema, model } = require("mongoose");

const progresslogSchema = new Schema(
  {
    figure: { type: Schema.Types.ObjectId, ref: "Figure" },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: Schema.Types.ObjectId, ref: "Status" },
    image: String,
    content: String,
    date: Date,
    imgPublicId: String,
  },
  { timestamps: true }
);

const ProgressLog = model("ProgressLog", progresslogSchema);
module.exports = ProgressLog;
