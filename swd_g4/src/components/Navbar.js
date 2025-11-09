// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";
import "../assets/styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/contact">Contact</NavLink>
      <NavLink to="/users">Management Account</NavLink>
      <NavLink to="/catalogs">View Catalog</NavLink>
       
    </nav>
  );
}
