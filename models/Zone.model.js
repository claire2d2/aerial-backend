const { Schema, model } = require("mongoose");

const zoneSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
});

const Zone = model("Zone", zoneSchema);

module.exports = Zone;
