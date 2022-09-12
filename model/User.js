const mongoose = require("./db.js");

const userSchema = new mongoose.Schema({
  username: String,
  exercise: [
    {
      description: String,
      duration: Number,
      date: String
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
