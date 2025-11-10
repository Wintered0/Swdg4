import React, { useState } from 'react';
import axios from 'axios';

const ReturnBook = () => {
  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');
  const [response, setResponse] = useState(null);

  const handleReturn = async () => {
    try {
      const res = await axios.post('http://localhost:9999/api/return', {
        userId,
        bookId
      });
      setResponse(res.data);
    } catch (err) {
      setResponse({ error: err.response?.data?.message || 'Lỗi không xác định' });
    }
  };

  return (
    <div>
      <h2>Trả Sách</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{height: '25px', borderRadius: '10px', width: '30%'}}
      />
      <input
        type="text"
        placeholder="Book ID"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        style={{height: '25px', borderRadius: '10px', marginLeft: '10px',  width: '30%'}}
      />
      <button onClick={handleReturn} style={{marginLeft: '20px'}}>Thực hiện trả</button>

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h4>Kết quả:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ReturnBook;
