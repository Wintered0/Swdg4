const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const userRoutes = require("./routes/AllRoute");

const bookRoutes = require("./routes/BookRoute");
dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running and connected to MongoDB Atlas");
});

app.use("/api", userRoutes);
app.use("/api/books", bookRoutes);
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
