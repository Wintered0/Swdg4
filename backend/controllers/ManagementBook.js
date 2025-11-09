const Book = require("../models/Book");

/* ===== GET ALL BOOKS ===== */
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find(); 
    res.status(200).json(books);
  } catch (err) {
    console.error("Error retrieving books:", err.message);
    res.status(500).json({ error: err.message });
  }
};
/* ===== GET BY ID ===== */
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Không tìm thấy sách" });
    res.status(200).json(book);
  } catch (err) {
    console.error("Get book error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ===== CREATE ===== */
exports.createBook = async (req, res) => {
  try {
    console.log("Received book:", req.body); // log dữ liệu nhận
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error("Create book error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

/* ===== UPDATE ===== */
exports.updateBook = async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Không tìm thấy sách để cập nhật" });
    res.status(200).json(updated);
  } catch (err) {
    console.error("Update book error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

/* ===== DELETE ===== */
exports.deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Không tìm thấy sách để xóa" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Delete book error:", err.message);
    res.status(400).json({ error: err.message });
  }
};
