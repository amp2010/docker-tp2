const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = 3001;
const app = express();
const router = express.Router();

const dbRoute = "mongodb://mongo:27017/user";

const options = {
    autoIndex: false,
    reconnectTries: 10, // Retry up to 10 times
    reconnectInterval: 500,
    poolSize: 5,
    bufferMaxEntries: 0
};

const connectWithRetry = () => {
  mongoose.connect(dbRoute, options).then(()=>{
    console.log('MongoDB connection succeeded')
  }).catch(() =>{
    console.log('MongoDB connection failed, retrying ...');
    setTimeout(connectWithRetry, 5000)
  })
};

connectWithRetry();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// GET
router.get("/users", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// DELETE
router.delete("/user", (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// POST
router.post("/user", (req, res) => {
  let data = new Data();
  const { userId, firstname, lastname } = req.body;

  if (!userId || !firstname || !lastname) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.firstname = firstname;
  data.lastname = lastname;
  data.userId = userId;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
