const mongoose = require("./db.js");

const exerciseSchema = new mongoose.Schema({
  user_id: String,
  username: String,
  description: String,
  duration: String,
  date: Date
});

module.exports = mongoose.model("Exercise", exerciseSchema);
