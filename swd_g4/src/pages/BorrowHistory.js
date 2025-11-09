import { useEffect, useState } from "react";
import { getBorrowHistory } from "../services/transactionService";
import "../assets/styles/userlist.css";

export default function BorrowHistory() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    studentId: "",
    studentName: "",
    bookTitle: "",
    startDate: "",
    endDate: "",
    status: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadHistory = async () => {
    try {
      setError("");
      const res = await getBorrowHistory(filters);
      setTransactions(res.data);
      // Log search operation
      console.log("Search performed with filters:", filters);
    } catch (err) {
      console.error("Lỗi khi tải lịch sử:", err);
      setError("Không thể tải lịch sử mượn/trả. Vui lòng thử lại.");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    // Validate input data
    if (filters.startDate && filters.endDate && new Date(filters.startDate) > new Date(filters.endDate)) {
      setError("Ngày bắt đầu không thể sau ngày kết thúc.");
      return;
    }
    if (filters.studentId && !/^\d+$/.test(filters.studentId)) {
      setError("ID học sinh phải là số.");
      return;
    }
    loadHistory();
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
    // Log view operation
    console.log("Viewed transaction details for:", transaction._id);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedTransaction(null);
  };

  const handleExport = (format = 'csv') => {
    try {
      if (format === 'csv') {
        // Simple CSV export
        const csv = transactions.map(t =>
          `${t.userId?.name || ''},${t.bookId?.title || ''},${new Date(t.borrowDate).toLocaleDateString()},${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ''},${t.returnDate ? new Date(t.returnDate).toLocaleDateString() : ''},${t.status},${isOverdue(t.dueDate, t.returnDate, t.status) ? 'Quá hạn' : 'Đúng hạn'}`
        ).join('\n');
        const blob = new Blob([`Tên học sinh,Tên sách,Ngày mượn,Hạn trả,Ngày trả,Tình trạng,Quá hạn\n${csv}`], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'borrow_history.csv';
        a.click();
      } else if (format === 'pdf') {
        // For PDF, we'll use a simple HTML-to-PDF approach
        const printWindow = window.open('', '_blank');
        const html = `
          <html>
            <head>
              <title>Lịch sử Mượn/Trả Sách</title>
              <style>
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h2>Lịch sử Mượn/Trả Sách</h2>
              <table>
                <thead>
                  <tr>
                    <th>Tên học sinh</th>
                    <th>Tên sách</th>
                    <th>Ngày mượn</th>
                    <th>Hạn trả</th>
                    <th>Ngày trả</th>
                    <th>Tình trạng</th>
                    <th>Quá hạn</th>
                  </tr>
                </thead>
                <tbody>
                  ${transactions.map(t => `
                    <tr>
                      <td>${t.userId?.name || 'N/A'}</td>
                      <td>${t.bookId?.title || 'N/A'}</td>
                      <td>${new Date(t.borrowDate).toLocaleDateString('vi-VN')}</td>
                      <td>${t.dueDate ? new Date(t.dueDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                      <td>${t.returnDate ? new Date(t.returnDate).toLocaleDateString('vi-VN') : '-'}</td>
                      <td>${t.status === 'Returned' ? 'Đã trả' : 'Đang mượn'}</td>
                      <td>${isOverdue(t.dueDate, t.returnDate, t.status) ? 'Quá hạn' : 'Đúng hạn'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (err) {
      console.error("Lỗi khi xuất báo cáo:", err);
      setError("Không thể xuất báo cáo. Vui lòng thử lại.");
    }
  };

  const isOverdue = (dueDate, returnDate, status) => {
    if (status === 'Returned' && returnDate) {
      return new Date(returnDate) > new Date(dueDate);
    }
    return status === 'Borrowed' && new Date() > new Date(dueDate);
  };

  return (
    <div className="container">
      <h2 className="title">Lịch sử Mượn/Trả Sách (UC-07)</h2>

      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

      <div className="filter-section">
        <div className="filter-row">
          <input
            type="text"
            name="studentId"
            placeholder="ID học sinh"
            value={filters.studentId}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="studentName"
            placeholder="Tên học sinh"
            value={filters.studentName}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="bookTitle"
            placeholder="Tên sách"
            value={filters.bookTitle}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-row">
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">Tất cả trạng thái</option>
            <option value="Borrowed">Đang mượn</option>
            <option value="Returned">Đã trả</option>
          </select>
          <button onClick={handleSearch}>Tìm kiếm</button>
          <button onClick={() => handleExport('csv')}>Xuất CSV</button>
          <button onClick={() => handleExport('pdf')}>Xuất PDF</button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Tên học sinh</th>
            <th>Tên sách</th>
            <th>Ngày mượn</th>
            <th>Hạn trả</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Quá hạn</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id}>
              <td>{t.userId?.name || 'N/A'}</td>
              <td>{t.bookId?.title || 'N/A'}</td>
              <td>{new Date(t.borrowDate).toLocaleDateString('vi-VN')}</td>
              <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
              <td>{t.returnDate ? new Date(t.returnDate).toLocaleDateString('vi-VN') : '-'}</td>
              <td>
                <span className={`status ${t.status === 'Returned' ? 'active' : 'inactive'}`}>
                  {t.status === 'Returned' ? 'Đã trả' : 'Đang mượn'}
                </span>
              </td>
              <td>
                {isOverdue(t.dueDate, t.returnDate, t.status) ? (
                  <span className="status overdue">Quá hạn</span>
                ) : (
                  <span className="status">Đúng hạn</span>
                )}
              </td>
              <td>
                <button onClick={() => handleViewDetails(t)}>Xem chi tiết</button>
                {isOverdue(t.dueDate, t.returnDate, t.status) && (
                  <button onClick={() => handleViewDetails(t)} style={{marginLeft: '5px'}}>Xem phạt</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDetailModal && selectedTransaction && (
        <div className="modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>Chi tiết giao dịch mượn/trả</h3>
            <div style={{marginBottom: '15px'}}>
              <strong>ID giao dịch:</strong> {selectedTransaction._id}
            </div>
            <div style={{marginBottom: '15px'}}>
              <strong>Học sinh:</strong> {selectedTransaction.userId?.name || 'N/A'} (ID: {selectedTransaction.userId?._id || 'N/A'})
            </div>
            <div style={{marginBottom: '15px'}}>
              <strong>Sách:</strong> {selectedTransaction.bookId?.title || 'N/A'} (ID: {selectedTransaction.bookId?._id || 'N/A'})
            </div>
            <div style={{marginBottom: '15px'}}>
              <strong>Ngày mượn:</strong> {new Date(selectedTransaction.borrowDate).toLocaleString('vi-VN')}
            </div>
            <div style={{marginBottom: '15px'}}>
              <strong>Hạn trả:</strong> {selectedTransaction.dueDate ? new Date(selectedTransaction.dueDate).toLocaleString('vi-VN') : 'N/A'}
            </div>
            <div style={{marginBottom: '15px'}}>
              <strong>Ngày trả:</strong> {selectedTransaction.returnDate ? new Date(selectedTransaction.returnDate).toLocaleString('vi-VN') : 'Chưa trả'}
            </div>
            <div style={{marginBottom: '15px'}}>
              <strong>Trạng thái:</strong> {selectedTransaction.status === 'Returned' ? 'Đã trả' : 'Đang mượn'}
            </div>
            <div style={{marginBottom: '15px'}}>
              <strong>Quá hạn:</strong> {isOverdue(selectedTransaction.dueDate, selectedTransaction.returnDate, selectedTransaction.status) ? 'Có' : 'Không'}
            </div>
            {isOverdue(selectedTransaction.dueDate, selectedTransaction.returnDate, selectedTransaction.status) && (
              <div style={{marginBottom: '15px', color: 'red'}}>
                <strong>Chi tiết phạt (UC-07.1):</strong>
                <div>Số ngày quá hạn: {Math.ceil((new Date(selectedTransaction.returnDate || new Date()) - new Date(selectedTransaction.dueDate)) / (1000 * 60 * 60 * 24))}</div>
                <div>Số tiền phạt: {Math.ceil((new Date(selectedTransaction.returnDate || new Date()) - new Date(selectedTransaction.dueDate)) / (1000 * 60 * 60 * 24)) * 5000} VND (5,000 VND/ngày)</div>
              </div>
            )}
            <div style={{marginBottom: '15px'}}>
              <strong>Ghi chú:</strong> {selectedTransaction.notes || 'Không có'}
            </div>
            <button onClick={closeModal} style={{padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}