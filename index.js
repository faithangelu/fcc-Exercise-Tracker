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
  const users = await user.find({}, "_id username");

  res.json(users);
});

app.post("/api/users/:_id/exercises", urlencodeParser, async (req, res) => {
  try {
    user.findById(req.params._id, (err, data) => {
      if (err) console.error(err);

      let newExerciseDetails = new exercise({
        username: data.username,
        description: req.body.description,
        duration: req.body.duration,
        date:
          req.body.date === ""
            ? new Date().toDateString()
            : new Date(req.body.date).toDateString()
      });

      newExerciseDetails.save((err, result) => {
        if (err) return console.error(err);
        res.json({
          _id: req.params._id,
          username: result.username,
          description: result.description,
          duration: result.duration,
          date: new Date(result.date).toDateString()
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  let user_id = req.params._id;
  let { from, to, limit } = req.query;

  try {
    const userDetail = await user.findById(user_id);

    const exerciseDetail = await exercise.find({
      username: userDetail.username
    });
    let logs;
    console.log(exerciseDetail.length);

    // if (from && to) {
    logs = exerciseDetail.map(d => {
      // if (
      //   Date.parse(d.date) >= Date.parse(from) &&
      //   Date.parse(d.date) <= Date.parse(to)
      // ) {
      return {
        description: d.description,
        duration: d.duration,
        date: new Date(d.date).toDateString()
      };
      // }
    });

    // logDetails["description"] = logs.description;
    // logDetails["duration"] = logs.duration;
    // logDetails["date"] = logs.date;
    // }

    if (limit) {
      data = exerciseDetail.filter((d, i) => i < limit);
    }

    let logDetails = {
      _id: userDetail._id,
      username: userDetail.username,
      count: exerciseDetail.length,
      logs: logs
    };
    res.json(logDetails);
  } catch (err) {
    console.log(err);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// app.post("/api/users/:_id/exercises", urlencodeParser, async (req, res) => {
//   let user_id = req.params._id;

//   try {
//     let exerciseObj = {
//       description: req.body.description,
//       duration: req.body.duration,
//       date:
//         req.body.date === ""
//           ? new Date().toDateString()
//           : new Date(req.body.date).toDateString()
//     };

//     const exerciseDetails = await user.findByIdAndUpdate(user_id, {
//       $push: { exercise: exerciseObj }
//     });
//     let response = {
//       _id: exerciseDetails._id,
//       username: exerciseDetails.username
//     };

//     response["description"] = exerciseObj.description;
//     response["duration"] = parseInt(exerciseObj.duration);
//     response["date"] = new Date(exerciseObj.date).toDateString();
//     res.json(response);
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/api/users/:_id/exercises", urlencodeParser, async (req, res) => {
//   try {
//     const userExercise = await user.findById(req.params._id);

//     res.json({
//       username: userExercise.username,
//       description: userExercise.description,
//       duration: userExercise.duration,
//       data: new Date(userExercise.date).toDateString(),
//       _id: userExercise._id
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/api/users/:_id/exercises", urlencodeParser, async (req, res) => {
//   try {
//     const user = await exercise.findById(req.params._id);
//     const userExercise = await exercise.find({ user_id: req.params._id });

//     let userObj = {
//       _id: user._id,
//       username: user.username
//     };

//     (userObj["description"] = userExercise.description),
//       (userObj["duration"] = userExercise.duration);
//     (userObj[data] = new Date(userExercise.date).toDateString()),
//       res.json(userObj);
//   } catch (err) {
//     console.log(err);
//   }
// });
