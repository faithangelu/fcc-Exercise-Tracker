const mongoose = require("./db.js");

const exerciseSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date
});

module.exports = mongoose.model("Exercise", exerciseSchema);
