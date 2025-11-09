const mongoose = require("mongoose");

const rfidCardSchema = new mongoose.Schema({
  cardId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  issuedDate: Date,
  expirationDate: Date, 
  status: String,
});
module.exports = mongoose.model("RFIDCard", rfidCardSchema);
