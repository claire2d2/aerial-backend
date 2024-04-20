const { Schema, model } = require("mongoose");

const figureSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  ref: {
    type: String,
    unique: true,
  },
  discipline: {
    type: Schema.Types.ObjectId,
    ref: "Discipline",
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dtjq1xo1o/image/upload/fl_preserve_transparency/v1713629786/aerialAPI/default_ogmqim.jpg?_s=public-apps",
  },
  imgArtist: {
    type: String,
    default: "missing",
  },
  imgArtistUrl: {
    type: String,
    default: "",
  },
  focus: [
    {
      type: Schema.Types.ObjectId,
      ref: "Zone",
    },
  ],
});

const Figure = model("Figure", figureSchema);

module.exports = Figure;
