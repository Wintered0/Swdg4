const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true,
  },

  name: {
    type: String,
    required: [true, "Tên là bắt buộc"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email là bắt buộc"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Email không hợp lệ"],
  },
  password: {
    type: String,
    required: [true, "Mật khẩu là bắt buộc"],
    validate: {
      validator: (v) =>
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(v),
      message:
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái và số",
    },
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User", "Librarian"],
    default: "User",
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Pending"],
    default: "Active",
  },
  isProcessingTransaction: {
    type: Boolean,
    default: false, // BR3: kiểm tra khi xoá librarian
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
