const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Models
const user = require("./model/User.js");

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
  const users = await user.find({}, "_id username");

  res.json(users);
});

app.post("/api/users/:_id/exercises", urlencodeParser, async (req, res) => {
  let user_id = req.params._id;

  try {
    let exerciseObj = {
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date === "" ? new Date() : new Date(req.body.date)
    };

    const exerciseDetails = await user.findByIdAndUpdate(user_id, {
      $push: { exercise: exerciseObj }
    });
    let response = {
      _id: exerciseDetails._id,
      username: exerciseDetails.username
    };

    response["description"] = exerciseObj.description;
    response["duration"] = parseInt(exerciseObj.duration);
    response["date"] = new Date(exerciseObj.date).toDateString();
    res.json(response);
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/users/:_id/exercises", urlencodeParser, async (req, res) => {
  try {
    const userExercise = await user.findById(req.params._id);

    res.json({
      username: userExercise.username,
      description: userExercise.description,
      duration: userExercise.duration,
      data: new Date(userExercise.date).toDateString(),
      _id: userExercise._id
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  let user_id = req.params._id;
  let { from, to, limit } = req.query;

  try {
    let userLogs = await user.findById(user_id);
    // let exerciselogs;
    // if (from && to && limit) {
    //   let filteredDates = userLogs.exercise.filter(item => {
    //     let convertedFrom = new Date(from).toDateString();
    //     let convertedTo = new Date(to).toDateString();

    //     return (
    //       Date.parse(item.date) >= Date.parse(convertedFrom) &&
    //       Date.parse(item.date) <= Date.parse(convertedTo)
    //     );
    //   });

    //   exerciselogs = filteredDates
    //     .map(data => {
    //       return {
    //         description: data.description,
    //         duration: parseInt(data.duration),
    //         date: new Date(data.date).toDateString()
    //       };
    //     })
    //     // .sort()
    //     .slice(0, limit);
    // } else {
    // }

    let response = {
      _id: userLogs._id,
      username: userLogs.username,
      count: userLogs.exercise.length
    };
    let exerciselogs = userLogs.exercise.map(item => {
      return {
        description: item.description,
        duration: parseInt(item.duration),
        date: new Date(item.date).toDateString()
      };
    });

    response["logs"] = exerciselogs;
    res.json(response);
  } catch (err) {
    console.log(err);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
