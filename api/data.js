const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    userId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", DataSchema);
