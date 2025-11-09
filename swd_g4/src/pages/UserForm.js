import { useEffect, useState } from "react";
import { createUser, updateUser } from "../services/userService";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles/userform.css";

export default function UserForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "Pass1234", // mặc định khi tạo mới
    phoneNumber: "",
    role: "User",
    status: "Active",
  });

  const [error, setError] = useState(""); // thêm state để lưu lỗi

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:9999/api/users/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error("Lỗi khi lấy người dùng:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // reset lỗi khi người dùng nhập lại
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateUser(id, form);
      } else {
        await createUser({ ...form, password: "Pass1234" });
      }
      navigate("/users");
    } catch (err) {
      console.error("Lỗi khi lưu:", err.response?.data || err.message);
      if (err.response?.status === 400 && err.response?.data?.error?.includes("Email")) {
        setError("Email đã tồn tại, vui lòng nhập email khác.");
      } else {
        alert("Không thể lưu người dùng. Vui lòng kiểm tra lại.");
      }
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>{id ? "✏️ Cập nhật người dùng" : "➕ Tạo người dùng mới"}</h2>

      <label>Tên</label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <label>Email</label>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      {error && <p className="error">{error}</p>} {/* hiển thị lỗi email */}

      
        <>
          <label>Password</label>
          <input
            name="password"
            type="text"
            value={form.password}
            onChange={handleChange}
            required
          />
        </>
      

      <label>Số điện thoại</label>
      <input
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleChange}
      />

      <label>Vai trò</label>
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="Admin">Admin</option>
        <option value="Librarian">Librarian</option>
        <option value="User">User</option>
      </select>

      <label>Trạng thái</label>
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Pending">Pending</option>
      </select>

      <button type="submit">Lưu</button>
    </form>
  );
}
