import axios from "axios";

const API_URL = "http://localhost:9999/api/access";

export const scanRFID = (cardId) => axios.post(`${API_URL}/scan`, { cardId });
export const validateRFID = (cardId) => axios.post(`${API_URL}/validate`, { cardId });
export const checkBorrowStatus = (cardId) => axios.post(`${API_URL}/check-status`, { cardId });
export const setAccess = (cardId) => axios.post(`${API_URL}/set`, { cardId });