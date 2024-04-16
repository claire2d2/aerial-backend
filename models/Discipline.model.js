const { Schema, model } = require("mongoose");

const disciplineSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
});

const Discipline = model("Discipline", disciplineSchema);

module.exports = Discipline;
