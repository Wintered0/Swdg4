import { useEffect, useState } from "react";
import { createBook, updateBook, getBookById } from "../services/bookService";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/styles/userform.css";

export default function BookForm() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    available: true,
    publishedDate: "",
    location: "",
    quantity: 1,
    condition: "Good",
    remarks: ""
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getBookById(id).then((res) => setForm(res.data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateBook(id, form);
      } else {
        await createBook(form);
      }
      navigate("/books");
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      alert("Không thể lưu sách. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>{id ? "✏️ Cập nhật sách" : "➕ Thêm sách mới"}</h2>

      <label>Tiêu đề</label>
      <input name="title" value={form.title} onChange={handleChange} required />

      <label>Tác giả</label>
      <input name="author" value={form.author} onChange={handleChange} required />

      <label>ISBN</label>
      <input name="isbn" value={form.isbn} onChange={handleChange} required />

      <label>Thể loại</label>
      <input name="category" value={form.category} onChange={handleChange} />

      <label>Ngày xuất bản</label>
      <input name="publishedDate" type="date" value={form.publishedDate} onChange={handleChange} />

      <label>Vị trí</label>
      <input name="location" value={form.location} onChange={handleChange} />

      <label>Số lượng</label>
      <input name="quantity" type="number" value={form.quantity} onChange={handleChange} min="0" />

      <label>Tình trạng</label>
      <select name="condition" value={form.condition} onChange={handleChange}>
        <option value="New">Mới</option>
        <option value="Good">Tốt</option>
        <option value="Fair">Trung bình</option>
        <option value="Poor">Kém</option>
      </select>

      <label>Ghi chú</label>
      <textarea name="remarks" value={form.remarks} onChange={handleChange} />

      <label>
        <input name="available" type="checkbox" checked={form.available} onChange={handleChange} />
        Có sẵn
      </label>

      <button type="submit">Lưu</button>
    </form>
  );
}