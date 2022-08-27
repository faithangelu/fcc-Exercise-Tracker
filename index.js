const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Models
const user = require("./model/User.js");
const exercise = require("./model/Exercise.js");

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

let urlencodeParser = bodyParser.urlencoded({ extended: true });
app.post("/api/users", urlencodeParser, (req, res) => {
  let username = req.body.username;

  let userDetails = new user({
    username: username
  });

  try {
    userDetails.save((err, data) => {
      if (err) return console.error(err);
      res.json({ _id: data._id, username: data.username });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/users", (req, res) => {
  user.find({}, function (err, users) {
    res.json(users);
  });
});

app.post("/api/users/:_id/exercises", urlencodeParser, (req, res) => {
  let user_id = req.params._id;

  try {
    exercise.findByIdAndUpdate(
      { _id: user_id },
      {
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date == "" ? Date.now() : req.body.date
      },
      function (err, exerciseDetails) {
        if (err) return console.error(err);

        res.json(exerciseDetails);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/users/:_id/logs", (req, res) => {
  let user_id = req.params._id;

  exercise.findById({ _id: user_id }, (err, usernameDetails) => {
    if (err) return console.error(err);
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
