const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(), // Tự sinh ID
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Email không hợp lệ"],
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User", "Librarian"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Pending"],
    default: "active",
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
