const mongoose = require("./db.js");

const userSchema = new mongoose.Schema({
  username: String,
  exercise: Array
});

module.exports = mongoose.model("User", userSchema);
