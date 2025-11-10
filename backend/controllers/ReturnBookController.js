const User = require('../models/User');
const Book = require('../models/Book');
const BorrowTransaction = require('../models/BorrowTransaction');

const returnBook = async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    // Tìm user theo _id
    const user = await User.findById(userId);
    if (!user || user.status !== 'Active' || user.role !== 'User') {
      return res.status(404).json({ message: 'User not found or inactive' });
    }

    // Kiểm tra trạng thái giao dịch
    if (!user.isProcessingTransaction) {
      return res.status(403).json({ message: 'User is not authorized to perform transaction at this time' });
    }

    // Tìm sách theo _id
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Tìm giao dịch mượn chưa trả
    const transaction = await BorrowTransaction.findOne({
      userId: user._id,
      bookId: book._id,
      status: 'Borrowed'
    });

    if (!transaction) {
      return res.status(404).json({ message: 'No active borrow transaction found for this user and book' });
    }

    // Cập nhật giao dịch
    const returnDate = new Date();
    transaction.returnDate = returnDate;
    transaction.status = 'Returned';
    await transaction.save();

    // Cập nhật sách
    book.quantity += 1;
    book.available = true;
    book.lastUpdated = new Date();
    await book.save();

    // Trả về dữ liệu giống như borrow
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

module.exports = { returnBook };
