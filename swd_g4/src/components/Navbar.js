// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import "../assets/styles/navbar.css";

export default function Navbar() {
  const role = localStorage.getItem("role"); // lấy role sau khi login
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token"); // nếu có token thì xoá luôn
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/contact">Contact</NavLink>

      {/* Nếu đã login thì hiển thị menu khác */}
      {role && (
        <>
          {role === "Admin" && (
            <NavLink to="/users">Management Account</NavLink>
          )}
          <NavLink to="/catalogs">View Catalog</NavLink>
          <NavLink to="/books">Books</NavLink>
          <NavLink to="/borrow-history">Borrow History (UC-07)</NavLink>
          <NavLink to="/inventory">Inventory (UC-08)</NavLink>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </>
      )}

      {/* Nếu chưa login thì hiện nút Login */}
      {!role && <NavLink to="/login">Login</NavLink>}
    </nav>
  );
}
