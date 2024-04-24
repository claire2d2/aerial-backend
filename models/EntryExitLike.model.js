const { Schema, model } = require("mongoose");

const likeSchema = new Schema({
  entryExit: { type: Schema.Types.ObjectId, ref: "EntryExit" },
  follower: { type: Schema.Types.ObjectId, ref: "User" },
});

const Like = model("EntryExitLike", likeSchema);

module.exports = Like;
