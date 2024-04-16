const { Schema, model } = require("mongoose");

const favoriteSchema = new Schema({
  figure: Schema.Types.ObjectId,
  user: Schema.Types.ObjectId,
});

const Favorite = model("Favorite", favoriteSchema);

module.exports = Favorite;
