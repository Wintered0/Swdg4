const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email không tồn tại" });
    }

    // kiểm tra mật khẩu dạng plain text
    if (password !== user.password) {
      return res.status(400).json({ error: "Sai mật khẩu" });
    }

    // trả về thông tin user (không tạo token)
    res.json({
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
