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
  quantity: { type: Number, default: 1, min: 0 },
  condition: { type: String, enum: ["New", "Good", "Fair", "Poor"], default: "Good" },
  remarks: String,
  lastUpdated: Date,
}, { timestamps: true });
module.exports = mongoose.model("Book", bookSchema);
