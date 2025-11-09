const mongoose = require("mongoose");

const borrowTransactionSchema = new mongoose.Schema({
  transactionId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  borrowDate: Date,
  dueDate: Date,
  returnDate: Date,
  status: String,
});
module.exports = mongoose.model("BorrowTransaction", borrowTransactionSchema);
