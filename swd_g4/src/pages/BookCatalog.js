import React, { useState, useEffect, useMemo } from "react";
import { getBooks } from "../services/bookService";

const BookCatalog = () => {
  const [books, setBooks] = useState([]);      // toàn bộ sách từ API
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟢 Gọi API một lần khi load trang
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await getBooks();
        setBooks(res.data || []);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải danh sách sách.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // 🧠 Tính danh sách category duy nhất từ DB
  const categories = useMemo(() => {
    const unique = new Set();
    books.forEach((b) => {
      if (b.category) unique.add(b.category.trim());
    });
    return Array.from(unique);
  }, [books]);

  // 🧠 Lọc theo keyword và category (client-side)
  const filteredBooks = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const cat = category.trim().toLowerCase();

    return books.filter((b) => {
      const title = (b.title || "").toLowerCase();
      const author = (b.author || "").toLowerCase();
      const bookCat = (b.category || "").toLowerCase();

      const matchKw = kw ? title.includes(kw) || author.includes(kw) : true;
      const matchCat = cat ? bookCat === cat : true;

      return matchKw && matchCat;
    });
  }, [books, keyword, category]);

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
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
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
