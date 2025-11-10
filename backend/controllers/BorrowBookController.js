const User = require('../models/User');
const Book = require('../models/Book');
const BorrowTransaction = require('../models/BorrowTransaction');

const borrowBook = async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    // Tìm user theo userId
    const user = await User.findOne({  userId, status: 'Active', role: 'User' });
    if (!user) return res.status(404).json({ message: 'User not found or inactive' });

    // Kiểm tra trạng thái giao dịch
    if (!user.isProcessingTransaction) {
      return res.status(403).json({ message: 'User is not authorized to perform transaction at this time' });
    }

    // Tìm sách theo bookId
    // const book = await Book.findOne({ bookId: bookId });
    const book = await Book.findById(bookId); 
    if (!book || book.available === false || book.quantity < 1) {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }

    // Tạo transaction
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate.getTime() + 5 * 24 * 60 * 60 * 1000); // ví dụ: 5 ngày

    const transaction = await BorrowTransaction.create({
      transactionId: `${user._id}-${book._id}-${Date.now()}`,
      userId: user._id,
      bookId: book._id,
      borrowDate,
      dueDate,
      returnDate: null,
      status: 'Borrowed'
    });

    // Cập nhật sách
    book.available = book.quantity > 1;
    book.quantity -= 1;
    book.lastUpdated = new Date();
    await book.save();

    // Trả về dữ liệu giống ảnh
    res.status(200).json({
      _id: transaction._id,
      userId: transaction.userId,
      bookId: transaction.bookId,
      borrowDate: transaction.borrowDate,
      dueDate: transaction.dueDate,
      returnDate: transaction.returnDate,
      status: transaction.status
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { borrowBook };
