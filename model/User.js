const mongoose = require("./db.js");

const userSchema = new mongoose.Schema({
  username: String,
  count: Number
  exercise: Array
});

module.exports = mongoose.model("User", userSchema);
