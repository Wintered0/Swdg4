const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config(); // Load biến môi trường từ .env

connectDB(); // Kết nối MongoDB

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running and connected to MongoDB Atlas");
});

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
