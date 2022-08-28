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
    let exerciseObj = {
      description: req.body.description,
      duration: req.body.duration,
      date:
        req.body.date == ""
          ? new Date(Date.now()).toDateString()
          : new Date(req.body.date).toDateString()
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
        response["duration"] = exerciseObj.duration;
        response["date"] = exerciseObj.date;
        res.json(response);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/users/:_id/logs", (req, res) => {
  let user_id = req.params._id;

  var userLog = exercise.find({ user_id: user_id });
  userLog.count((err, usernameDetails) => {
    if (err) return console.error(err);
    res.json(usernameDetails);
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
