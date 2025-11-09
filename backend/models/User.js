const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  phoneNumber: String,
  role: String,
  status: String,
});
module.exports = mongoose.model("User", userSchema);
