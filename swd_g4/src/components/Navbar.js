// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";
import "../assets/styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end>Trang chủ</NavLink>
      <NavLink to="/about">Giới thiệu</NavLink>
      <NavLink to="/contact">Liên hệ</NavLink>
      <NavLink to="/users">Quản lý người dùng</NavLink>
      <NavLink to="/books">Quản lý sách</NavLink>
      <NavLink to="/borrow-history">Lịch sử mượn/trả</NavLink>
      <NavLink to="/inventory">Quản lý kho</NavLink>
    </nav>
  );
}
