const RFIDCard = require("../models/RFIDCard");
const User = require("../models/User");
const BorrowTransaction = require("../models/BorrowTransaction");

// Scan RFID
exports.scanRFID = async (req, res) => {
  try {
    const { cardId } = req.body;

    const rfidCard = await RFIDCard.findOne({ cardId }).populate("userId");
    
    if (!rfidCard) {
      return res.status(404).json({ 
        error: "RFID card không tồn tại",
        accessGranted: false 
      });
    }

    res.json({
      message: "Quét RFID thành công",
      card: rfidCard
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Validate RFID
exports.validateRFID = async (req, res) => {
  try {
    const { cardId } = req.body;

    const rfidCard = await RFIDCard.findOne({ cardId }).populate("userId");
    
    if (!rfidCard) {
      return res.status(404).json({ 
        error: "RFID card không hợp lệ",
        isValid: false 
      });
    }

    // Kiểm tra trạng thái thẻ
    if (rfidCard.status !== "Active") {
      return res.status(400).json({ 
        error: `Thẻ ${rfidCard.status}`,
        isValid: false 
      });
    }

    // Kiểm tra hạn sử dụng
    if (new Date() > new Date(rfidCard.expirationDate)) {
      return res.status(400).json({ 
        error: "Thẻ đã hết hạn",
        isValid: false 
      });
    }

    // Kiểm tra user
    if (!rfidCard.userId || rfidCard.userId.status !== "Active") {
      return res.status(400).json({ 
        error: "User không hợp lệ hoặc bị khóa",
        isValid: false 
      });
    }

    res.json({
      message: "RFID hợp lệ",
      isValid: true,
      card: rfidCard
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check Borrow Status
exports.checkBorrowStatus = async (req, res) => {
  try {
    const { cardId } = req.body;

    const rfidCard = await RFIDCard.findOne({ cardId }).populate("userId");
    
    if (!rfidCard || !rfidCard.userId) {
      return res.status(404).json({ error: "Không tìm thấy thông tin" });
    }

    // Tìm các giao dịch chưa trả của user
    const activeTransactions = await BorrowTransaction.find({
      userId: rfidCard.userId._id,
      status: "Borrowed"
    }).populate("bookId");

    // Kiểm tra quá hạn
    const now = new Date();
    const overdueTransactions = activeTransactions.filter(
      t => new Date(t.dueDate) < now
    );

    const hasViolation = overdueTransactions.length > 0;

    res.json({
      userId: rfidCard.userId._id,
      userName: rfidCard.userId.name,
      activeBorrows: activeTransactions.length,
      overdueCount: overdueTransactions.length,
      hasViolation,
      overdueBooks: overdueTransactions.map(t => ({
        bookTitle: t.bookId?.title,
        dueDate: t.dueDate,
        daysOverdue: Math.floor((now - new Date(t.dueDate)) / (1000 * 60 * 60 * 24))
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Set Access (Grant or Deny)
exports.setAccess = async (req, res) => {
  try {
    const { cardId } = req.body;

    // Validate RFID
    const rfidCard = await RFIDCard.findOne({ cardId }).populate("userId");
    
    if (!rfidCard) {
      return res.status(404).json({ 
        accessGranted: false,
        reason: "RFID card không tồn tại"
      });
    }

    if (rfidCard.status !== "Active") {
      return res.status(403).json({ 
        accessGranted: false,
        reason: `Thẻ ${rfidCard.status}`
      });
    }

    if (new Date() > new Date(rfidCard.expirationDate)) {
      return res.status(403).json({ 
        accessGranted: false,
        reason: "Thẻ đã hết hạn"
      });
    }

    if (!rfidCard.userId || rfidCard.userId.status !== "Active") {
      return res.status(403).json({ 
        accessGranted: false,
        reason: "User không hợp lệ"
      });
    }

    // Check borrow status
    const activeTransactions = await BorrowTransaction.find({
      userId: rfidCard.userId._id,
      status: "Borrowed"
    });

    const now = new Date();
    const overdueTransactions = activeTransactions.filter(
      t => new Date(t.dueDate) < now
    );

    if (overdueTransactions.length > 0) {
      return res.status(403).json({ 
        accessGranted: false,
        reason: `Có ${overdueTransactions.length} sách quá hạn`,
        overdueCount: overdueTransactions.length
      });
    }

    // Grant access
    res.json({
      accessGranted: true,
      message: "Cho phép truy cập",
      user: {
        name: rfidCard.userId.name,
        email: rfidCard.userId.email,
        role: rfidCard.userId.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  scanRFID,
  validateRFID,
  checkBorrowStatus,
  setAccess
};