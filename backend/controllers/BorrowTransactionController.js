const BorrowTransaction = require("../models/BorrowTransaction");
const Book = require("../models/Book");
const User = require("../models/User");

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await BorrowTransaction.find()
      .populate('userId', 'name email')
      .populate('bookId', 'title author isbn');
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { userId, bookId, borrowDate, dueDate } = req.body;

    // Check if book is available
    const book = await Book.findById(bookId);
    if (!book || !book.available) {
      return res.status(400).json({ error: "Sách không khả dụng" });
    }

    const newTransaction = new BorrowTransaction({
      userId,
      bookId,
      borrowDate: borrowDate || new Date(),
      dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      status: "Borrowed"
    });

    await newTransaction.save();

    // Update book availability
    await Book.findByIdAndUpdate(bookId, { available: false });

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error("Create transaction error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { transactionId, returnDate } = req.body;

    const transaction = await BorrowTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Không tìm thấy giao dịch" });
    }

    if (transaction.status === "Returned") {
      return res.status(400).json({ error: "Sách đã được trả" });
    }

    // Update transaction
    transaction.returnDate = returnDate || new Date();
    transaction.status = "Returned";
    await transaction.save();

    // Update book availability
    await Book.findByIdAndUpdate(transaction.bookId, { available: true });

    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await BorrowTransaction.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('bookId', 'title author isbn');
    if (!transaction) return res.status(404).json({ error: "Không tìm thấy giao dịch" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get borrow/return history with filtering
exports.getBorrowHistory = async (req, res) => {
  try {
    const { studentId, studentName, bookTitle, startDate, endDate, status } = req.query;

    let filter = {};

    if (studentId) {
      const user = await User.findOne({ userId: studentId });
      if (user) filter.userId = user._id;
    }

    if (studentName) {
      const users = await User.find({ name: { $regex: studentName, $options: 'i' } });
      filter.userId = { $in: users.map(u => u._id) };
    }

    if (bookTitle) {
      const books = await Book.find({ title: { $regex: bookTitle, $options: 'i' } });
      filter.bookId = { $in: books.map(b => b._id) };
    }

    if (startDate && endDate) {
      filter.borrowDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (status) {
      filter.status = status;
    }

    const transactions = await BorrowTransaction.find(filter)
      .populate('userId', 'name email userId')
      .populate('bookId', 'title author isbn')
      .sort({ borrowDate: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};