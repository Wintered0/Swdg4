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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    // Validate input
    if (editForm.quantity < 0) {
      alert("Số lượng không thể âm");
      return;
    }

    // Confirmation dialog
    const confirmUpdate = window.confirm(`Bạn có chắc muốn cập nhật kho cho sách "${inventory.find(b => b._id === editingBook)?.title}"?\n\nSố lượng mới: ${editForm.quantity}\nTình trạng: ${editForm.condition}\nGhi chú: ${editForm.remarks || 'Không có'}`);

    if (!confirmUpdate) {
      return;
    }

    try {
      await updateInventory(editingBook, editForm);
      setEditingBook(null);
      loadInventory();
      loadAlerts();
      // Log update operation
      console.log("Inventory updated for book:", editingBook, "with data:", editForm);
    } catch (err) {
      console.error("Lỗi khi cập nhật kho:", err);
      alert("Không thể cập nhật kho. Vui lòng thử lại.");
    }
  };

  const handleGenerateReport = async () => {
    try {
      const res = await generateInventoryReport();
      setReport(res.data);
      // Log report generation
      console.log("Inventory report generated:", res.data);
    } catch (err) {
      console.error("Lỗi khi tạo báo cáo:", err);
      alert("Không thể tạo báo cáo. Vui lòng thử lại.");
    }
  };

  const handleExportReport = (format = 'pdf') => {
    if (!report) {
      alert("Vui lòng tạo báo cáo trước khi xuất.");
      return;
    }

    try {
      if (format === 'pdf') {
        const printWindow = window.open('', '_blank');
        const html = `
          <html>
            <head>
              <title>Báo cáo Kho Sách</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h2 { color: #333; }
                .summary { background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; }
                table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .footer { margin-top: 30px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <h2>Báo cáo Kho Sách</h2>
              <div class="summary">
                <p><strong>Tổng số sách:</strong> ${report.totalBooks}</p>
                <p><strong>Sách có sẵn:</strong> ${report.availableBooks}</p>
                <p><strong>Sách kho thấp:</strong> ${report.lowStockBooks}</p>
                <p><strong>Ngày tạo:</strong> ${new Date(report.generatedAt).toLocaleString('vi-VN')}</p>
              </div>
              <h3>Chi tiết sách kho thấp:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Tác giả</th>
                    <th>Số lượng hiện tại</th>
                    <th>Vị trí</th>
                  </tr>
                </thead>
                <tbody>
                  ${inventory.filter(book => book.quantity <= 5).map(book => `
                    <tr>
                      <td>${book.title}</td>
                      <td>${book.author}</td>
                      <td>${book.quantity}</td>
                      <td>${book.location}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div class="footer">
                Báo cáo được tạo bởi hệ thống quản lý thư viện vào ${new Date().toLocaleString('vi-VN')}
              </div>
            </body>
          </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
      } else if (format === 'csv') {
        const csv = inventory.map(book =>
          `${book.title},${book.author},${book.category},${book.quantity},${book.condition},${book.location},${book.remarks || ''}`
        ).join('\n');
        const blob = new Blob([`Tiêu đề,Tác giả,Thể loại,Số lượng,Tình trạng,Vị trí,Ghi chú\n${csv}`], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory_report.csv';
        a.click();
      }
    } catch (err) {
      console.error("Lỗi khi xuất báo cáo:", err);
      alert("Không thể xuất báo cáo. Vui lòng thử lại.");
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
          <button onClick={() => handleExportReport('pdf')}>Xuất PDF</button>
          <button onClick={() => handleExportReport('csv')}>Xuất CSV</button>
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