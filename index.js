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

app.post("/api/users", urlencodeParser, async (req, res) => {
  let paramUsername = req.body.username;

  try {
    let newUserDetails = new user({
      username: paramUsername
    });

    const userSaved = await newUserDetails.save();
    res.json({
      _id: userSaved._id,
      username: userSaved.username
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/users", async (req, res) => {
  const users = await user.find();

  res.json(users);
});

app.post("/api/users/:_id/exercises", urlencodeParser, async (req, res) => {
  let user_id = req.params._id;

  try {
    user.findById(user_id, (err, data) => {
      if (err) return console.error("Retrieving user details: " + err);
      if (data) {
        let newExercise = new exercise({
          user_id: user_id,
          username: data.username,
          description: req.body.description,
          duration: req.body.duration,
          date: req.body.date == "" ? Date.now() : req.body.date
        });

        newExercise.save((err, exercise) => {
          if (err) return console.error("Saving the exercise data: " + err);
          res.json({
            username: data.username,
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date,
            _id: data.user_id
          });
        });
      }
    });
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
