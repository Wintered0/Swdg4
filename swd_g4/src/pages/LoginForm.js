import { useState } from "react";
import axios from "axios";
import "../assets/styles/login.css";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: form.email.trim(),
        password: form.password.trim(),
      };

      const res = await axios.post("http://localhost:9999/api/login", payload);

      // chỉ lưu role để điều hướng giao diện
      localStorage.setItem("role", res.data.user.role);

      alert("Đăng nhập thành công!");
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi đăng nhập");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>🔑 Đăng nhập</h2>

      <label>Email</label>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <label>Password</label>
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        required
      />

      {error && <p className="error">{error}</p>}

      <button type="submit">Đăng nhập</button>
    </form>
  );
}
