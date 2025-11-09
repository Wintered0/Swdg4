const Book = require("../models/Book");

exports.getInventory = async (req, res) => {
  try {
    const { category, author, condition } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (condition) filter.condition = condition;

    const books = await Book.find(filter);
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, condition, remarks } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ error: "Số lượng không thể âm" });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: "Không tìm thấy sách" });
    }

    // Update book with inventory fields
    const updatedBook = await Book.findByIdAndUpdate(id, {
      quantity: quantity,
      condition: condition || book.condition,
      remarks: remarks || book.remarks,
      lastUpdated: new Date()
    }, { new: true });

    // Check for low stock alert
    if (quantity <= 5) { // Assuming threshold is 5
      // In a real system, this would trigger notifications
      console.log(`Low stock alert for book: ${updatedBook.title}`);
    }

    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLowStockAlerts = async (req, res) => {
  try {
    const threshold = req.query.threshold || 5;
    const lowStockBooks = await Book.find({
      quantity: { $lte: threshold },
      available: true
    });

    res.json(lowStockBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generateInventoryReport = async (req, res) => {
  try {
    const books = await Book.find();
    const totalBooks = books.length;
    const availableBooks = books.filter(book => book.available).length;
    const lowStockBooks = books.filter(book => book.quantity <= 5).length;

    const report = {
      totalBooks,
      availableBooks,
      lowStockBooks,
      books: books.map(book => ({
        title: book.title,
        author: book.author,
        quantity: book.quantity,
        condition: book.condition,
        location: book.location
      })),
      generatedAt: new Date()
    };

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};