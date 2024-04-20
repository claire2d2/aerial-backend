const { Schema, model } = require("mongoose");

const favoriteSchema = new Schema({
  figure: { type: Schema.Types.ObjectId, ref: "Figure" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
    default: "Favorites",
  },
});

const Favorite = model("Favorite", favoriteSchema);

module.exports = Favorite;
