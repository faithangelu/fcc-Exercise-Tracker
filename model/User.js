const mongoose = require("./db.js");

const userSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: String,
  date: Date
});

module.exports = mongoose.model("User", userSchema);
