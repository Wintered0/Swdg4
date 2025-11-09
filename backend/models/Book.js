const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookId: String,
  title: String,
  author: String,
  isbn: String,
  category: String,
  available: Boolean,
  publishedDate: Date,
  location: String,
});
module.exports = mongoose.model("Book", bookSchema);
