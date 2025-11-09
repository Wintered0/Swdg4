// src/routes/index.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/HomePage";
import About from "../pages/About";
import Contact from "../pages/Contact";
import UserList from "../pages/UserList";
import UserForm from "../pages/UserForm";
export default function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* Quản lí tài khoản*/}
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/edit/:id" element={<UserForm />} />

        {/* Quản lý sách */}
        <Route path="/books" element={<BookList />} />
        <Route path="/books/new" element={<BookForm />} />
        <Route path="/books/edit/:id" element={<BookForm />} />

        {/* Lịch sử mượn/trả (UC-07) */}
        <Route path="/borrow-history" element={<BorrowHistory />} />

        {/* Quản lý kho (UC-08) */}
        <Route path="/inventory" element={<InventoryManagement />} />

      </Routes>
    </MainLayout>
  );
}
