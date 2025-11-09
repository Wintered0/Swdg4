import React, { useState, useEffect } from "react";
import { getBooks } from "../services/bookService";

const BookCatalog = () => {
  const [books, setBooks] = useState([]);         // Dữ liệu gốc (tất cả sách)
  const [filteredBooks, setFilteredBooks] = useState([]); // Dữ liệu sau khi lọc
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟢 Gọi API 1 lần duy nhất khi load trang
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await getBooks(); // lấy toàn bộ danh sách
        setBooks(res.data);
        setFilteredBooks(res.data);   // hiển thị ban đầu
      } catch (err) {
        alert("Lỗi khi tải danh sách sách.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // 🟢 Tự động lọc lại khi keyword hoặc category thay đổi
  useEffect(() => {
    let filtered = books;

    // Lọc theo keyword (title hoặc author)
    if (keyword.trim() !== "") {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(lowerKeyword) ||
          b.author.toLowerCase().includes(lowerKeyword)
      );
    }

    // Lọc theo category
    if (category !== "") {
      filtered = filtered.filter((b) => b.category === category);
    }

    setFilteredBooks(filtered);
  }, [keyword, category, books]); // Mỗi khi 3 giá trị này thay đổi → tự lọc lại

  return (
    <div style={{ padding: "20px" }}>
      <h2>📖 Book Catalog</h2>

      {/* 🔍 Form tìm kiếm */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginRight: 10 }}
        >
          <option value="">All Categories</option>
          <option value="Fiction">Fiction</option>
          <option value="Science">Science</option>
          <option value="Programming">Programming</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredBooks.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Available</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((b) => (
              <tr key={b._id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category}</td>
                <td>{b.available ? "✅ Available" : "❌ Borrowed"}</td>
                <td>{b.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookCatalog;
