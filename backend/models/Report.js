const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportId: String,
  reportType:String,
  createdDate: Date,
  generatedBy:String,
  content:String
});
module.exports = mongoose.model("Report", reportSchema);
