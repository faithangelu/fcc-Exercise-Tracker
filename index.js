const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Models
const user = require("./model/User.js");
const exercise = require("./model/Exercise.js");

const port = process.env.PORT || 3000;

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
    let exerciseObj = {
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date === "" ? Date.now() : req.body.date
    };
    user.findByIdAndUpdate(
      user_id,
      { $push: { exercise: exerciseObj } },
      async (err, data) => {
        if (err) return console.error("Retrieving user details: " + err);
        let response = {
          _id: data._id,
          username: data.username
        };

        response["description"] = exerciseObj.description;
        response["duration"] = parseInt(exerciseObj.duration);
        response["date"] = new Date(exerciseObj.date).toDateString();
        res.json(response);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/users/:_id/exercises", urlencodeParser, async (req, res) => {
  try {
    const userExercise = user.findById(req.params._id);
    res.json({
      username: userExercise.username,
      description: userExercise.description,
      duration: userExercise.duration,
      data: userExercise.date,
      _id: userExercise._id
    });
  } catch (err) {}
});

app.get("/api/users/:_id/logs", (req, res) => {
  let user_id = req.params._id;

  user.find({ _id: user_id }, async (err, data) => {
    if (err) return console.error(err);
    res.json({
      username: data[0].username,
      count: data[0].exercise.length,
      _id: data[0]._id,
      log: data[0].exercise
    });

    // let response = {
    //   username: data[0].username,
    //   count: data[0].exercise.length,
    //   _id: data[0]._id
    // };

    // response["logs"] = data[0].exercise.map(item => ({
    //   description: item.description,
    //   duration: parseInt(item.duration),
    //   date: new Date(item.date).toDateString()
    // }));

    // res.json(response);
  });
  // userLog.count((err, usernameDetails) => {
  // });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
