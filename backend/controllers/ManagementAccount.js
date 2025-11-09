const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    // Nếu có middleware auth thì bật lại check quyền Admin
    // if (!req.user || req.user.role !== "Admin") {
    //   return res.status(403).json({ error: "Chỉ Admin được phép tạo tài khoản." });
    // }

    // kiểm tra trùng email
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ error: "Email đã tồn tại." });
    }

    // mật khẩu mặc định nếu chưa nhập (phải hợp lệ với regex: có chữ + số)
    const password = req.body.password || "Pass1234";

    const user = new User({
      ...req.body,
      password,
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Không tìm thấy user." });

    // Nếu là librarian đang xử lý giao dịch thì không cho xoá
    if (user.role === "Librarian" && user.isProcessingTransaction) {
      return res.status(400).json({ error: "Không thể xoá librarian đang xử lý giao dịch." });
    }

    await user.deleteOne();
    res.json({ message: "Xoá user thành công." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
