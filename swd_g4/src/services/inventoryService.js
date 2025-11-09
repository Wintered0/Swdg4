import axios from "axios";

const API_URL = "http://localhost:9999/api/inventory";

export const getInventory = (params) => axios.get(API_URL, { params });
export const updateInventory = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const getLowStockAlerts = (threshold) => axios.get(`${API_URL}/alerts`, { params: { threshold } });
export const generateInventoryReport = () => axios.get(`${API_URL}/report`);