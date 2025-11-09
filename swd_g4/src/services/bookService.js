import axios from "axios";

const API_URL = "http://localhost:9999/api/books";

// Lấy toàn bộ danh sách sách
export const getBooks = () => axios.get(API_URL);

// Lấy chi tiết 1 sách theo ID
export const getBookById = (id) => axios.get(`${API_URL}/${id}`);

// Thêm sách mới
export const createBook = (data) => axios.post(API_URL, data);

// Cập nhật thông tin sách
export const updateBook = (id, data) => axios.put(`${API_URL}/${id}`, data);

// Xóa sách
export const deleteBook = (id) => axios.delete(`${API_URL}/${id}`);
