const mongoose = require("mongoose");

const systemLogsSchema = new mongoose.Schema({
  logId: String,
  actionType: String,
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timeStamp: Date,
  description: String,
});
module.exports = mongoose.model("SystemLogs", systemLogsSchema);
