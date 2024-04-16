const { Schema, model } = require("mongoose");

const figureSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  discipline: {
    type: Schema.Types.ObjectId,
  },
  difficulty: {
    type: String,
    enum: ["beginner", "inter", "advanced"],
  },
  image: String,
  imgArtist: String,
  imgArtistUrl: String,
});

const Figure = model("Figure", figureSchema);

module.exports = Figure;
