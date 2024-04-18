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
  image: String,
  imgArtist: String,
  imgArtistUrl: String,
});

const Figure = model("Figure", figureSchema);

module.exports = Figure;
