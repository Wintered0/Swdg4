import axios from "axios";

const API_URL = "http://localhost:9999/api/transactions";
const BORROW_HISTORY_URL = "http://localhost:9999/api/borrow-history";

export const getTransactions = () => axios.get(API_URL);
export const createTransaction = (data) => axios.post(API_URL, data);
export const returnBook = (data) => axios.put(`${API_URL}/return`, data);
export const getTransactionById = (id) => axios.get(`${API_URL}/${id}`);
export const getBorrowHistory = (params) => axios.get(BORROW_HISTORY_URL, { params });