import "../assets/styles/userlist.css";
import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers().then((res) => setUsers(res.data));
  }, []);

  const handleDelete = async (id) => {
  if (window.confirm("Bạn có chắc muốn xoá người dùng này?")) {
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      alert("Xoá user thành công.");
    } catch (err) {
      // Nếu backend trả về error message thì hiển thị
      const msg = err.response?.data?.error || "Không thể xoá người dùng.";
      alert(msg);
    }
  }
};

  

  return (
    <div className="container">
      <h2 className="title">Danh sách người dùng</h2>
      <button className="createBtn" onClick={() => navigate("/users/new")}>
        Tạo người dùng mới
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <span className={`status ${u.status?.toLowerCase()}`}>{u.status}</span>

              </td>
              <td>
                <button className="editBtn" onClick={() => navigate(`/users/edit/${u._id}`)}>Sửa</button>
                <button className="deleteBtn" onClick={() => handleDelete(u._id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
