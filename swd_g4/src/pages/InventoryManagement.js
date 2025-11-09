import { useEffect, useState } from "react";
import { getInventory, updateInventory, getLowStockAlerts, generateInventoryReport } from "../services/inventoryService";
import "../assets/styles/userlist.css";

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [report, setReport] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    author: "",
    condition: ""
  });
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({
    quantity: 0,
    condition: "Good",
    remarks: ""
  });

  useEffect(() => {
    loadInventory();
    loadAlerts();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await getInventory(filters);
      setInventory(res.data);
    } catch (err) {
      console.error("Lỗi khi tải kho:", err);
    }
  };

  const loadAlerts = async () => {
    try {
      const res = await getLowStockAlerts(5);
      setAlerts(res.data);
    } catch (err) {
      console.error("Lỗi khi tải cảnh báo:", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    loadInventory();
  };

  const handleEdit = (book) => {
    setEditingBook(book._id);
    setEditForm({
      quantity: book.quantity || 0,
      condition: book.condition || "Good",
      remarks: book.remarks || ""
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      await updateInventory(editingBook, editForm);
      setEditingBook(null);
      loadInventory();
      loadAlerts();
    } catch (err) {
      console.error("Lỗi khi cập nhật kho:", err);
      alert("Không thể cập nhật kho");
    }
  };

  const handleGenerateReport = async () => {
    try {
      const res = await generateInventoryReport();
      setReport(res.data);
    } catch (err) {
      console.error("Lỗi khi tạo báo cáo:", err);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Quản lý Kho (UC-08)</h2>

      <div className="filter-section">
        <div className="filter-row">
          <input
            type="text"
            name="category"
            placeholder="Thể loại"
            value={filters.category}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="author"
            placeholder="Tác giả"
            value={filters.author}
            onChange={handleFilterChange}
          />
          <select name="condition" value={filters.condition} onChange={handleFilterChange}>
            <option value="">Tất cả tình trạng</option>
            <option value="New">Mới</option>
            <option value="Good">Tốt</option>
            <option value="Fair">Trung bình</option>
            <option value="Poor">Kém</option>
          </select>
          <button onClick={handleSearch}>Lọc</button>
          <button onClick={handleGenerateReport}>Tạo báo cáo</button>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="alert-section">
          <h3>⚠️ Cảnh báo kho thấp:</h3>
          <ul>
            {alerts.map(book => (
              <li key={book._id}>{book.title} - Số lượng: {book.quantity}</li>
            ))}
          </ul>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Thể loại</th>
            <th>Số lượng</th>
            <th>Tình trạng</th>
            <th>Vị trí</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>
                {editingBook === book._id ? (
                  <input
                    type="number"
                    name="quantity"
                    value={editForm.quantity}
                    onChange={handleEditChange}
                    min="0"
                  />
                ) : (
                  book.quantity || 0
                )}
              </td>
              <td>
                {editingBook === book._id ? (
                  <select name="condition" value={editForm.condition} onChange={handleEditChange}>
                    <option value="New">Mới</option>
                    <option value="Good">Tốt</option>
                    <option value="Fair">Trung bình</option>
                    <option value="Poor">Kém</option>
                  </select>
                ) : (
                  book.condition || "Good"
                )}
              </td>
              <td>{book.location}</td>
              <td>
                {editingBook === book._id ? (
                  <input
                    type="text"
                    name="remarks"
                    value={editForm.remarks}
                    onChange={handleEditChange}
                    placeholder="Ghi chú"
                  />
                ) : (
                  book.remarks || "-"
                )}
              </td>
              <td>
                {editingBook === book._id ? (
                  <>
                    <button onClick={handleSaveEdit}>Lưu</button>
                    <button onClick={() => setEditingBook(null)}>Hủy</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(book)}>Cập nhật</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {report && (
        <div className="report-section">
          <h3>Báo cáo Kho</h3>
          <p>Tổng số sách: {report.totalBooks}</p>
          <p>Sách có sẵn: {report.availableBooks}</p>
          <p>Sách kho thấp: {report.lowStockBooks}</p>
          <p>Ngày tạo: {new Date(report.generatedAt).toLocaleString('vi-VN')}</p>
        </div>
      )}
    </div>
  );
}