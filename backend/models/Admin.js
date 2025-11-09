const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  adminId: String,
  name: String,
  email: String,
  phoneNumber: String,
  role: String,
  status: String,
});
module.exports = mongoose.model("Admin", adminSchema);
