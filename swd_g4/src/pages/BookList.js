import "../assets/styles/userlist.css";
import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../services/bookService";
import { useNavigate } from "react-router-dom";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getBooks().then((res) => setBooks(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá sách này?")) {
      await deleteBook(id);
      setBooks(books.filter((b) => b._id !== id));
    }
  };

  return (
    <div className="container">
      <h2 className="title">Danh sách sách</h2>
      <button className="createBtn" onClick={() => navigate("/books/new")}>
        Thêm sách mới
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Thể loại</th>
            <th>ISBN</th>
            <th>Số lượng</th>
            <th>Tình trạng</th>
            <th>Có sẵn</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b._id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.category}</td>
              <td>{b.isbn}</td>
              <td>{b.quantity}</td>
              <td>{b.condition}</td>
              <td>
                <span className={`status ${b.available ? 'active' : 'inactive'}`}>
                  {b.available ? 'Có' : 'Không'}
                </span>
              </td>
              <td>
                <button className="editBtn" onClick={() => navigate(`/books/edit/${b._id}`)}>Sửa</button>
                <button className="deleteBtn" onClick={() => handleDelete(b._id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}