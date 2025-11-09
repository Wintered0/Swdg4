const mongoose = require("mongoose");

const librarianSchema = new mongoose.Schema({
  librarianId: String,
  name: String,
  email: String,
  phoneNumber: String,
  role: String,
  status: String,
});
module.exports = mongoose.model("Librarian", librarianSchema);
