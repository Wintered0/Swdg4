const mongoose = require("mongoose");

const kioskSchema = new mongoose.Schema({
  kioskId: String,
  location: String,
  status: String,
  lastServicedDate: Date,
});
module.exports = mongoose.model("Kiosk", kioskSchema);
