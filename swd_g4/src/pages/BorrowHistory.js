import { useEffect, useState } from "react";
import { getBorrowHistory } from "../services/transactionService";
import "../assets/styles/userlist.css";

export default function BorrowHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    studentId: "",
    studentName: "",
    bookTitle: "",
    startDate: "",
    endDate: "",
    status: ""
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getBorrowHistory(filters);
      setTransactions(res.data);
    } catch (err) {
      console.error("Lỗi khi tải lịch sử:", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    loadHistory();
  };

  const handleExport = () => {
    // Simple CSV export
    const csv = transactions.map(t =>
      `${t.userId?.name || ''},${t.bookId?.title || ''},${new Date(t.borrowDate).toLocaleDateString()},${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ''},${t.returnDate ? new Date(t.returnDate).toLocaleDateString() : ''},${t.status}`
    ).join('\n');
    const blob = new Blob([`Tên học sinh,Tên sách,Ngày mượn,Hạn trả,Ngày trả,Tình trạng\n${csv}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'borrow_history.csv';
    a.click();
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
          <button onClick={handleExport}>Xuất Excel</button>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}