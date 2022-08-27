const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://backendfcc:password101@ac-a7mpeer-shard-00-00.ywvccth.mongodb.net:27017,ac-a7mpeer-shard-00-01.ywvccth.mongodb.net:27017,ac-a7mpeer-shard-00-02.ywvccth.mongodb.net:27017/?ssl=true&replicaSet=atlas-ras2pn-shard-0&authSource=admin&retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

module.exports = mongoose;
