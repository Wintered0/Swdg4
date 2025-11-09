// src/routes/index.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/HomePage";
import About from "../pages/About";
import Contact from "../pages/Contact";
import UserList from "../pages/UserList";
import UserForm from "../pages/UserForm";
import Login from "../pages/LoginForm";
export default function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        {/* Quản lí tài khoản*/}
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/edit/:id" element={<UserForm />} />
      
      </Routes>
    </MainLayout>
  );
}
