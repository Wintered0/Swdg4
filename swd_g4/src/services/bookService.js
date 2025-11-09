import axios from "axios";

const API_URL = "http://localhost:9999/api/books";

export const getBooks = () => axios.get(API_URL);
export const createBook = (data) => axios.post(API_URL, data);
export const updateBook = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteBook = (id) => axios.delete(`${API_URL}/${id}`);
export const getBookById = (id) => axios.get(`${API_URL}/${id}`);